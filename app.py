from flask import Flask, request, send_file
from PIL import Image
import io
import os
from flask_cors import CORS
import pillow_heif
import pillow_avif  # Import to register AVIF plugin
from pydub import AudioSegment

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)  # Enable CORS for all routes

# Serve static files
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/image-converter')
def image_converter():
    return app.send_static_file('image-converter.html')

@app.route('/audio-converter')
def audio_converter():
    return app.send_static_file('audio-converter.html')

@app.route('/video-converter')
def video_converter():
    return app.send_static_file('video-converter.html')

@app.route('/text-converter')
def text_converter():
    return app.send_static_file('text-converter.html')

# Serve other static files
@app.route('/<path:path>')
def serve_static(path):
    return app.send_static_file(path)

@app.route('/convert-audio', methods=['POST'])
def convert_audio():
    try:
        # Get the audio file, target format and original filename from the request
        audio_file = request.files.get('audio')
        target_format = request.form.get('format')
        original_filename = request.form.get('filename', 'converted_audio')

        if not audio_file or not target_format:
            return 'Missing audio file or format', 400

        # Read the audio file using pydub
        audio = AudioSegment.from_file(audio_file)

        # Prepare output buffer
        output_buffer = io.BytesIO()

        # Export the audio to the target format
        audio.export(output_buffer, format=target_format.lower())
        output_buffer.seek(0)

        # Send the converted audio
        return send_file(
            output_buffer,
            mimetype=f'audio/{target_format.lower()}',
            as_attachment=True,
            download_name=f'{original_filename}.{target_format.lower()}'
        )

    except Exception as e:
        print(f"Error converting audio: {str(e)}")
        return str(e), 500

@app.route('/convert', methods=['POST'])
def convert_image():
    try:
        # Get the image, target format and original filename from the request
        image_file = request.files.get('image')
        target_format = request.form.get('format')
        original_filename = request.form.get('filename', 'converted_image')

        if not image_file or not target_format:
            return 'Missing image or format', 400

        # Read the image using PIL
        image = Image.open(image_file)

        # Convert RGBA to RGB if needed
        if image.mode == 'RGBA' and target_format.lower() in ['jpg', 'heic']:
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[3])
            image = background

        # Prepare output buffer
        output_buffer = io.BytesIO()

        # Save the converted image to the buffer
        if target_format.lower() == 'jpg':
            image.save(output_buffer, 'JPEG', quality=95)
        elif target_format.lower() == 'heic':
            # Convert to RGB if not already
            if image.mode != 'RGB':
                image = image.convert('RGB')
            # Save as HEIC
            pillow_heif.save(output_buffer, image, quality=95)
        elif target_format.lower() == 'avif':
            # Convert to RGB if not already
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image.save(output_buffer, 'AVIF', quality=95, speed=6)
        elif target_format.lower() == 'tiff':
            image.save(output_buffer, 'TIFF', compression='tiff_lzw')
        elif target_format.lower() == 'bmp':
            image.save(output_buffer, 'BMP')
        else:
            image.save(output_buffer, target_format.upper())

        output_buffer.seek(0)

        # Send the converted image
        return send_file(
            output_buffer,
            mimetype=f'image/{target_format.lower()}',
            as_attachment=True,
            download_name=f'{original_filename}.{target_format.lower()}'
        )

    except Exception as e:
        print(f"Error converting image: {str(e)}")
        return str(e), 500

if __name__ == '__main__':
    # Ensure the static folder exists
    os.makedirs('static', exist_ok=True)
    
    # Copy frontend files to static folder if they exist
    import shutil
    for file in ['index.html', 'style.css', 'script.js']:
        if os.path.exists(file):
            shutil.copy(file, os.path.join('static', file))
    
    app.run(debug=True, port=5000)