# File Format Converter

A web-based application that allows users to convert files between different formats. Currently supports image, audio, video, and text file conversions.

Repository: [https://github.com/PierrunoYT/file-converter-web](https://github.com/PierrunoYT/file-converter-web)

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

### Video Conversion
- Supports conversion between multiple video formats:
  - MP4
  - AVI
  - MOV
  - MKV
  - WEBM
- Quality options:
  - High (8000k bitrate)
  - Medium (4000k bitrate)
  - Low (2000k bitrate)

### Text Document Conversion
- Supports conversion between multiple text document formats:
  - TXT (Plain Text)
  - DOC/DOCX (Microsoft Word)
  - PDF (Portable Document Format)
  - RTF (Rich Text Format)
  - ODT (OpenDocument Text)

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

1. Select the type of conversion you want to perform (Image, Audio, Video, or Text)
2. Upload your file(s) by dragging and dropping or clicking to browse
3. Select the desired output format
4. Click "Convert" to process your file(s)
5. The converted file(s) will be automatically downloaded

## Dependencies

- Flask: Web framework
- Pillow: Image processing
- pydub: Audio processing
- FFmpeg: Audio and Video processing backend (required for both audio and video conversions)
- pillow_heif: HEIC image support
- pillow_avif: AVIF image support
- python-docx: DOCX file handling
- PyPDF2: PDF file handling
- odfpy: ODT file handling

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
│   ├── audio-converter.html
│   ├── video-converter.html
│   ├── text-converter.html
│   ├── image-converter.js
│   ├── audio-converter.js
│   ├── video-converter.js
│   └── text-converter.js
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 PierrunoYT