from flask import request, send_file, abort
from PIL import Image
import io
import pillow_heif
import pillow_avif
from utils import validate_file
from config import ALLOWED_IMAGE_EXTENSIONS, logger

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

def handle_image_conversion():
    try:
        # Get and validate the image file
        image_file = request.files.get('image')
        filename = validate_file(image_file, ALLOWED_IMAGE_EXTENSIONS)
        
        target_format = request.form.get('format')
        if not target_format or target_format.lower() not in ALLOWED_IMAGE_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")
            
        compression = request.form.get('compression', '95')
        try:
            compression = int(compression)
            if not (0 <= compression <= 100):
                raise ValueError
        except ValueError:
            compression = 95
            
        original_filename = request.form.get('filename', 'converted_image')
        
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
            image.save(output_buffer, 'JPEG', quality=compression)
        elif target_format.lower() == 'heic':
            if image.mode != 'RGB':
                image = image.convert('RGB')
            pillow_heif.save(output_buffer, image, quality=compression)
        elif target_format.lower() == 'avif':
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image.save(output_buffer, 'AVIF', quality=compression, speed=6)
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