#!/usr/bin/env bash
# Script to setup and run the File Converter Web Application

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Python is installed
if ! command_exists python3; then
    if ! command_exists python; then
        echo "Error: Python is not installed or not in PATH" >&2
        exit 1
    fi
    PYTHON_CMD="python"
else
    PYTHON_CMD="python3"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create virtual environment" >&2
        exit 1
    fi
fi

# Ensure script is executable
chmod +x "$0"

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "Error: Failed to activate virtual environment" >&2
    exit 1
fi

# Upgrade pip first
echo "Upgrading pip..."
$PYTHON_CMD -m pip install --upgrade pip
if [ $? -ne 0 ]; then
    echo "Error: Failed to upgrade pip" >&2
    deactivate
    exit 1
fi

# Install requirements
echo "Installing dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies" >&2
    deactivate
    exit 1
fi

# Ensure moviepy is properly installed
echo "Ensuring moviepy is properly installed..."
$PYTHON_CMD -m pip install moviepy --upgrade
if [ $? -ne 0 ]; then
    echo "Error: Failed to install moviepy" >&2
    deactivate
    exit 1
fi

# Verify installations
echo "Verifying installations..."

# Create a temporary test script
cat > test_moviepy.py << 'EOL'
try:
    import sys
    import moviepy
    print(f'MoviePy version: {moviepy.__version__}')
    print(f'MoviePy location: {moviepy.__file__}')
    from moviepy.video.io.VideoFileClip import VideoFileClip
    print('MoviePy VideoFileClip successfully imported')
except Exception as e:
    print(f'Error: {str(e)}', file=sys.stderr)
    sys.exit(1)
EOL

# Run the test script
$PYTHON_CMD test_moviepy.py
if [ $? -ne 0 ]; then
    echo "Error: MoviePy verification failed" >&2
    rm test_moviepy.py
    deactivate
    exit 1
fi
rm test_moviepy.py

echo "All dependencies verified successfully"

# Start the Flask application
echo "Starting Flask application..."
$PYTHON_CMD app.py
if [ $? -ne 0 ]; then
    echo "Error: Failed to start Flask application" >&2
    deactivate
    exit 1
fi

# Deactivate virtual environment (this will only run if the app is stopped)
deactivate
