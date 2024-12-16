from flask import Flask
from flask_cors import CORS
import os

# Import configurations
from config import (
    MAX_CONTENT_LENGTH, FLASK_DEBUG, FLASK_PORT,
    STATIC_FOLDER, STATIC_URL_PATH, logger
)

# Import extensions
from extensions import init_limiter

# Import handlers
from handlers.image_handlers import handle_image_conversion
from handlers.audio_handlers import handle_audio_conversion
from handlers.video_handlers import handle_video_conversion
from handlers.text_handlers import handle_text_conversion
from routes import setup_routes
from utils import setup_static_folder

# Initialize Flask app
app = Flask(__name__, static_url_path=STATIC_URL_PATH, static_folder=STATIC_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
CORS(app)  # Enable CORS for all routes

# Initialize rate limiter
limiter = init_limiter(app)

# Setup routes
setup_routes(app)

if __name__ == '__main__':
    # Setup static folder
    setup_static_folder()
    
    # Run the app
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT)
