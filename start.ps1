# Script to setup and run the File Converter Web Application

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if Python is installed
if (-not (Test-Command "python")) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if (-not $?) {
        Write-Host "Error: Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate
if (-not $?) {
    Write-Host "Error: Failed to activate virtual environment" -ForegroundColor Red
    exit 1
}

# Upgrade pip first
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
if (-not $?) {
    Write-Host "Error: Failed to upgrade pip" -ForegroundColor Red
    deactivate
    exit 1
}

# Install requirements
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if (-not $?) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    deactivate
    exit 1
}

# Ensure moviepy is properly installed
Write-Host "Ensuring moviepy is properly installed..." -ForegroundColor Yellow
pip install moviepy --upgrade
if (-not $?) {
    Write-Host "Error: Failed to install moviepy" -ForegroundColor Red
    deactivate
    exit 1
}

# Verify installations
Write-Host "Verifying installations..." -ForegroundColor Yellow

# Create a temporary test script
$testScript = @'
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
'@

# Save and run the test script
$testScriptPath = "test_moviepy.py"
$testScript | Out-File -Encoding UTF8 $testScriptPath
python $testScriptPath
if (-not $?) {
    Write-Host "Error: MoviePy verification failed" -ForegroundColor Red
    Remove-Item $testScriptPath
    deactivate
    exit 1
}
Remove-Item $testScriptPath

Write-Host "All dependencies verified successfully" -ForegroundColor Green

# Start the Flask application
Write-Host "Starting Flask application..." -ForegroundColor Green
python app.py
if (-not $?) {
    Write-Host "Error: Failed to start Flask application" -ForegroundColor Red
    deactivate
    exit 1
}

# Deactivate virtual environment (this will only run if the app is stopped)
deactivate