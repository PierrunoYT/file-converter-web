from flask import request, send_file, abort
from pydub import AudioSegment
import io
from utils import validate_file
from config import ALLOWED_AUDIO_EXTENSIONS, logger

def handle_audio_conversion():
    try:
        # Get and validate the audio file
        audio_file = request.files.get('audio')
        filename = validate_file(audio_file, ALLOWED_AUDIO_EXTENSIONS)

        target_format = request.form.get('format')
        if not target_format or target_format.lower() not in ALLOWED_AUDIO_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_AUDIO_EXTENSIONS)}")

        original_filename = request.form.get('filename', 'converted_audio')

        logger.info(f"Starting audio conversion: {filename} to {target_format}")

        try:
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
            error_msg = f"Error during audio conversion: {str(e)}"
            logger.error(error_msg)
            return {"error": error_msg}, 500

    except Exception as e:
        error_msg = f"Error processing audio request: {str(e)}"
        logger.error(error_msg)
        return {"error": error_msg}, 500