@echo off
REM Script to setup and run the File Converter Web Application

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Error: Failed to create virtual environment
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
if errorlevel 1 (
    echo Error: Failed to activate virtual environment
    exit /b 1
)

REM Upgrade pip first
echo Upgrading pip...
python -m pip install --upgrade pip
if errorlevel 1 (
    echo Error: Failed to upgrade pip
    call deactivate
    exit /b 1
)

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    call deactivate
    exit /b 1
)

REM Ensure moviepy is properly installed
echo Ensuring moviepy is properly installed...
pip install moviepy --upgrade
if errorlevel 1 (
    echo Error: Failed to install moviepy
    call deactivate
    exit /b 1
)

REM Verify installations
echo Verifying installations...

REM Create a temporary test script
(
echo try:
echo     import sys
echo     import moviepy
echo     print(f'MoviePy version: {moviepy.__version__}'^)
echo     print(f'MoviePy location: {moviepy.__file__}'^)
echo     from moviepy.video.io.VideoFileClip import VideoFileClip
echo     print('MoviePy VideoFileClip successfully imported'^)
echo except Exception as e:
echo     print(f'Error: {str(e)}', file=sys.stderr^)
echo     sys.exit(1^)
) > test_moviepy.py

REM Run the test script
python test_moviepy.py
if errorlevel 1 (
    echo Error: MoviePy verification failed
    del test_moviepy.py
    call deactivate
    exit /b 1
)
del test_moviepy.py

echo All dependencies verified successfully

REM Start the Flask application
echo Starting Flask application...
python app.py
if errorlevel 1 (
    echo Error: Failed to start Flask application
    call deactivate
    exit /b 1
)

REM Deactivate virtual environment (this will only run if the app is stopped)
call deactivate
