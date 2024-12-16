from flask import request, send_file, abort
from moviepy.video.io.VideoFileClip import VideoFileClip
import tempfile
import os
from utils import validate_file, cleanup_temp_files
from config import ALLOWED_VIDEO_EXTENSIONS, logger

def handle_video_conversion():
    temp_files = []  # Keep track of temporary files
    try:
        # Get and validate the video file
        video_file = request.files.get('file')
        filename = validate_file(video_file, ALLOWED_VIDEO_EXTENSIONS)

        target_format = request.form.get('targetFormat')
        if not target_format or target_format not in ALLOWED_VIDEO_EXTENSIONS:
            abort(400, description=f"Invalid target format. Allowed formats: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}")

        quality = request.form.get('quality', 'high')  # high, medium, low

        logger.info(f"Starting video conversion: {filename} to {target_format}")

        # Create temporary files with unique names
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{video_file.filename.split(".")[-1]}')
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{target_format}')
        temp_files.extend([temp_input.name, temp_output.name])

        # Immediately close the file handles
        temp_input.close()
        temp_output.close()

        # Save the uploaded video
        video_file.save(temp_input.name)

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
            cleanup_temp_files(temp_files)

    except Exception as e:
        print(f"Error converting video: {str(e)}")
        return str(e), 500