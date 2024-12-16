from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize limiter without app
limiter = None

def init_limiter(app):
    """Initialize the rate limiter with the Flask app"""
    global limiter
    try:
        from redis import Redis
        
        try:
            redis_client = Redis(
                host='localhost',
                port=6379,
                db=0,
                socket_timeout=30,
                socket_connect_timeout=30
            )
            # Test the connection
            redis_client.ping()
            
            limiter = Limiter(
                app=app,
                key_func=get_remote_address,
                storage_uri="redis://localhost:6379",
                storage_options={"socket_connect_timeout": 30},
                default_limits=["200 per day", "50 per hour"]
            )
            app.logger.info("Rate limiting using Redis storage backend")
        except Exception as e:
            app.logger.warning(f"Redis connection failed: {str(e)}. Falling back to in-memory storage.")
            limiter = Limiter(
                app=app,
                key_func=get_remote_address,
                default_limits=["200 per day", "50 per hour"]
            )
    except ImportError:
        app.logger.warning("Redis package not installed. Using in-memory storage for rate limiting")
        limiter = Limiter(
            app=app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )

    if limiter is None:
        app.logger.warning("Failed to initialize rate limiter. Using default in-memory storage")
        limiter = Limiter(
            app=app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )
    
    return limiter