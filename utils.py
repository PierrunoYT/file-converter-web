from flask import abort
from werkzeug.utils import secure_filename
import os
import tempfile
import logging

logger = logging.getLogger(__name__)

def allowed_file(filename, allowed_extensions):
    """Check if a filename has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def validate_file(file, allowed_extensions):
    """Validate uploaded file and its extension."""
    if not file:
        abort(400, description="No file provided")
    filename = secure_filename(file.filename)
    if not allowed_file(filename, allowed_extensions):
        abort(400, description=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}")
    return filename

def create_temp_file(file, suffix=''):
    """Create a temporary file from uploaded file."""
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_file.close()
    file.save(temp_file.name)
    return temp_file.name

def cleanup_temp_files(temp_files):
    """Clean up temporary files."""
    for temp_file in temp_files:
        try:
            if os.path.exists(temp_file):
                try:
                    fd = os.open(temp_file, os.O_RDONLY)
                    try:
                        os.close(fd)
                    except OSError as e:
                        logger.warning(f"Failed to close file handle for {temp_file}: {str(e)}")
                except OSError as e:
                    logger.warning(f"Failed to open file {temp_file}: {str(e)}")
                try:
                    os.unlink(temp_file)
                except OSError as e:
                    logger.warning(f"Failed to delete file {temp_file}: {str(e)}")
        except Exception as e:
            logger.warning(f"Failed to clean up temporary file {temp_file}: {str(e)}")

def cleanup_temp_dir(temp_dir):
    """Clean up temporary directory and its contents."""
    try:
        if os.path.exists(temp_dir):
            import time
            time.sleep(0.1)  # Small delay to allow Windows to release handles
            for root, dirs, files in os.walk(temp_dir):
                for name in files:
                    try:
                        os.unlink(os.path.join(root, name))
                    except:
                        pass
            os.rmdir(temp_dir)
    except Exception as e:
        logger.warning(f"Failed to delete temporary directory {temp_dir}: {str(e)}")

def setup_static_folder():
    """Ensure static folder exists."""
    os.makedirs('static', exist_ok=True)
    logger.info("Static folder setup complete")
