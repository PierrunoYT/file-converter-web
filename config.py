import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File size limits
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'heic', 'avif'}
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
ALLOWED_TEXT_EXTENSIONS = {'txt', 'doc', 'docx', 'pdf', 'rtf', 'odt', 'md'}

# Rate limiting configuration
RATE_LIMIT_DEFAULT = ["200 per day", "50 per hour"]
RATE_LIMIT_VIDEO = "10 per minute"
RATE_LIMIT_AUDIO = "20 per minute"
RATE_LIMIT_IMAGE = "30 per minute"
RATE_LIMIT_TEXT = "20 per minute"

# Redis configuration
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0
REDIS_TIMEOUT = 30

# Flask configuration
FLASK_DEBUG = True
FLASK_PORT = 5000
STATIC_FOLDER = 'static'
STATIC_URL_PATH = '/static'