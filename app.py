from flask import Flask, request, send_file, abort
from PIL import Image
import io
import os
import logging
from flask_cors import CORS
import pillow_heif
import pillow_avif  # Import to register AVIF plugin
from pydub import AudioSegment
from moviepy.editor import VideoFileClip
import tempfile
from werkzeug.utils import secure_filename
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import docx
from docx import Document
from PyPDF2 import PdfReader, PdfWriter
import odf
from odf.opendocument import OpenDocumentText
from odf import text as odf_text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'heic', 'avif'}
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
ALLOWED_TEXT_EXTENSIONS = {'txt', 'doc', 'docx', 'pdf', 'rtf', 'odt'}

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

app = Flask(__name__, static_url_path='', static_folder='static')
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
CORS(app)  # Enable CORS for all routes

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def validate_file(file, allowed_extensions):
    if not file:
        abort(400, description="No file provided")
    filename = secure_filename(file.filename)
    if not allowed_file(filename, allowed_extensions):
        abort(400, description=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}")
    return filename

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

@app.route('/convert-video', methods=['POST'])
@limiter.limit("10 per minute")
def convert_video():
    try:
        # Get and validate the video file
        video_file = request.files.get('file')
        filename = validate_file(video_file, ALLOWED_VIDEO_EXTENSIONS)
        
        target_format = request.form.get('targetFormat')
        if not target_format or target_format not in ALLOWED_VIDEO_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}")
            
        quality = request.form.get('quality', 'high')  # high, medium, low
        
        logger.info(f"Starting video conversion: {filename} to {target_format}")

        # Create a temporary file to save the uploaded video
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{video_file.filename.split(".")[-1]}')
        video_file.save(temp_input.name)

        # Create a temporary file for the output
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{target_format}')

        try:
            # Load the video file
            video = VideoFileClip(temp_input.name)

            # Set bitrate based on quality
            bitrate = {
                'high': '8000k',
                'medium': '4000k',
                'low': '2000k'
            }.get(quality, '4000k')

            # Write the converted video
            video.write_videofile(
                temp_output.name,
                codec='libx264' if target_format == 'mp4' else None,
                bitrate=bitrate,
                audio_codec='aac' if target_format in ['mp4', 'mov'] else 'libvorbis',
                preset='medium',
                threads=4
            )

            # Close the video to free up resources
            video.close()

            # Send the converted video file
            return send_file(
                temp_output.name,
                mimetype=f'video/{target_format}',
                as_attachment=True,
                download_name=f'converted_video.{target_format}'
            )

        finally:
            # Clean up temporary files
            os.unlink(temp_input.name)
            if os.path.exists(temp_output.name):
                os.unlink(temp_output.name)

    except Exception as e:
        print(f"Error converting video: {str(e)}")
        return str(e), 500

@app.route('/convert-audio', methods=['POST'])
@limiter.limit("20 per minute")
def convert_audio():
    try:
        # Get and validate the audio file
        audio_file = request.files.get('audio')
        filename = validate_file(audio_file, ALLOWED_AUDIO_EXTENSIONS)
        
        target_format = request.form.get('format')
        if not target_format or target_format.lower() not in ALLOWED_AUDIO_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_AUDIO_EXTENSIONS)}")
            
        original_filename = secure_filename(request.form.get('filename', 'converted_audio'))
        
        logger.info(f"Starting audio conversion: {filename} to {target_format}")

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
@limiter.limit("30 per minute")
def convert_image():
    try:
        # Get and validate the image file
        image_file = request.files.get('image')
        filename = validate_file(image_file, ALLOWED_IMAGE_EXTENSIONS)
        
        target_format = request.form.get('format')
        if not target_format or target_format.lower() not in ALLOWED_IMAGE_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")
            
        compression = request.form.get('compression', '95')  # New compression parameter
        try:
            compression = int(compression)
            if not (0 <= compression <= 100):
                raise ValueError
        except ValueError:
            compression = 95
            
        original_filename = secure_filename(request.form.get('filename', 'converted_image'))
        
        logger.info(f"Starting image conversion: {filename} to {target_format}")

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
        error_msg = f"Error converting image: {str(e)}"
        logger.error(error_msg)
        return {"error": error_msg}, 500

@app.route('/convert/text', methods=['POST'])
@limiter.limit("20 per minute")
def convert_text():
    try:
        # Get and validate the text file
        text_file = request.files.get('file')
        filename = validate_file(text_file, ALLOWED_TEXT_EXTENSIONS)
        
        target_format = request.form.get('target_format')
        if not target_format or target_format.lower() not in ALLOWED_TEXT_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_TEXT_EXTENSIONS)}")

        # Create temporary files for input and output
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{filename.split(".")[-1]}')
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{target_format}')
        
        try:
            # Save input file
            text_file.save(temp_input.name)
            
            # Convert based on input and target formats
            if target_format == 'txt':
                # Convert to plain text
                if filename.endswith('.docx'):
                    doc = Document(temp_input.name)
                    with open(temp_output.name, 'w', encoding='utf-8') as f:
                        for para in doc.paragraphs:
                            f.write(para.text + '\n')
                elif filename.endswith('.pdf'):
                    reader = PdfReader(temp_input.name)
                    with open(temp_output.name, 'w', encoding='utf-8') as f:
                        for page in reader.pages:
                            f.write(page.extract_text() + '\n')
                elif filename.endswith('.odt'):
                    doc = OpenDocumentText(temp_input.name)
                    with open(temp_output.name, 'w', encoding='utf-8') as f:
                        for element in doc.getElementsByType(odf_text.P):
                            f.write(element.text + '\n')
                else:
                    # For txt files, just copy
                    with open(temp_input.name, 'r', encoding='utf-8') as f_in:
                        with open(temp_output.name, 'w', encoding='utf-8') as f_out:
                            f_out.write(f_in.read())
            
            elif target_format == 'docx':
                # Convert to DOCX
                doc = Document()
                if filename.endswith('.txt'):
                    with open(temp_input.name, 'r', encoding='utf-8') as f:
                        for line in f:
                            doc.add_paragraph(line.strip())
                elif filename.endswith('.pdf'):
                    reader = PdfReader(temp_input.name)
                    for page in reader.pages:
                        doc.add_paragraph(page.extract_text())
                doc.save(temp_output.name)
            
            elif target_format == 'pdf':
                # Convert to PDF
                writer = PdfWriter()
                if filename.endswith('.txt'):
                    # Create PDF from text
                    doc = Document()
                    with open(temp_input.name, 'r', encoding='utf-8') as f:
                        for line in f:
                            doc.add_paragraph(line.strip())
                    temp_docx = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')
                    doc.save(temp_docx.name)
                    # Convert DOCX to PDF using a PDF library
                    # Note: This is a placeholder. You'll need to implement actual DOCX to PDF conversion
                    # using a library like python-docx-pdf or similar
                    
            # Send the converted file
            return send_file(
                temp_output.name,
                mimetype=f'application/{target_format}',
                as_attachment=True,
                download_name=f'converted_document.{target_format}'
            )
            
        finally:
            # Clean up temporary files
            os.unlink(temp_input.name)
            if os.path.exists(temp_output.name):
                os.unlink(temp_output.name)
                
    except Exception as e:
        error_msg = f"Error converting text document: {str(e)}"
        logger.error(error_msg)
        return {"error": error_msg}, 500

if __name__ == '__main__':
    # Ensure the static folder exists
    os.makedirs('static', exist_ok=True)
    
    # Copy frontend files to static folder if they exist
    import shutil
    for file in ['index.html', 'style.css', 'script.js']:
        if os.path.exists(file):
            shutil.copy(file, os.path.join('static', file))
    
    app.run(debug=True, port=5000)