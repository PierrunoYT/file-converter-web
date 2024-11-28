# File Format Converter

A web-based application that allows users to convert files between different formats. Currently supports image and audio file conversions.

## Features

### Image Conversion
- Supports conversion between multiple image formats:
  - PNG
  - JPG/JPEG
  - WEBP
  - GIF
  - HEIC
  - AVIF
  - TIFF
  - BMP

### Audio Conversion
- Supports conversion between multiple audio formats:
  - MP3
  - WAV
  - OGG
  - M4A
  - FLAC
  - AAC

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install FFmpeg (required for audio conversion):
   - Windows: Install using chocolatey `choco install ffmpeg` or download from [FFmpeg official website](https://ffmpeg.org/download.html)
   - Mac: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`

## Running the Application

1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## Usage

1. Select the type of conversion you want to perform (Image or Audio)
2. Upload your file(s) by dragging and dropping or clicking to browse
3. Select the desired output format
4. Click "Convert" to process your file(s)
5. The converted file(s) will be automatically downloaded

## Dependencies

- Flask: Web framework
- Pillow: Image processing
- pydub: Audio processing
- FFmpeg: Audio/Video processing backend
- pillow_heif: HEIC image support
- pillow_avif: AVIF image support

## Development

The project structure is organized as follows:
```
.
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── static/            # Static files
│   ├── style.css
│   ├── script.js
│   ├── image-converter.html
│   └── audio-converter.html
└── README.md