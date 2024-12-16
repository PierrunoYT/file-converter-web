# All-In-One Converter

## Introduction

The **All-In-One Converter** is a comprehensive, web-based solution designed to handle a wide variety of file and unit conversion tasks. Whether you need to convert images, audio, videos, text files, or units like currency, speed, weight, and more, this tool simplifies the process with an intuitive and user-friendly interface. Built using modern web technologies such as **React**, **Redux**, and **Flask**, it ensures fast and reliable conversions.

---

## Features

🌟 **General Features**:
- Simple and interactive user interface.
- Real-time preview and result updates.
- Error handling with descriptive messages.

📦 **Supported Conversions**:
1. **File Conversions**:
   - **Image Converter**: PNG, JPG, WEBP, GIF, etc.
   - **Audio Converter**: MP3, WAV, AAC, FLAC, etc.
   - **Video Converter**: MP4, AVI, MKV, MOV, etc.
   - **Text Converter**: TXT, PDF, DOCX, etc.

2. **Unit Conversions**:
   - **Currency**: Convert between various currencies using live exchange rates.
   - **Speed**: Convert between m/s, km/h, mph, etc.
   - **Weight**: KG, LB, MG, and more.
   - **Angle**: Degrees, Radians, Gradians, etc.
   - **Energy**: Joules, Calories, kWh, and more.
   - **Volume**: Liters, Milliliters, Gallons, etc.
   - **Frequency**: Hz, kHz, MHz, and more.
   - **Power**: Watts, Horsepower, BTU, etc.
   - **Data Transfer Rates**: Mbps, Kbps, GBps, etc.

---

## Requirements

Before installing and running the **All-In-One Converter**, ensure you have the following:

- **Node.js** (v16.x or higher)
- **npm** or **yarn** (package managers for dependencies)
- **Python** (v3.7 or higher) for backend Flask APIs
- **Vite** for development and build optimization
- A modern web browser to access the application

---

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/PierrunoYT/All-In-One-Converter.git
   cd All-In-One-Converter
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd noYT-All-In-One-Converter-0e322d0
   npm install
   ```

3. **Set Up Backend**:
   - Ensure you have Python installed.
   - Install Flask and its dependencies:
     ```bash
     pip install flask flask-cors requests
     ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     flask run
     ```
   - Start the frontend server:
     ```bash
     npm run dev
     ```

5. **Access the App**:
   Open your browser and navigate to `http://localhost:4321`.

---

## Usage

### Web Interface
1. Select the type of conversion from the homepage (e.g., Image, Video, Currency, etc.).
2. Upload the required file or input the values.
3. Choose the conversion format or units.
4. Click **Convert** to see the results.

### API
The application also provides a REST API for programmatic access to its features. Example for currency conversion:
```bash
curl -X POST http://localhost:5000/api/convert/currency \
-d '{"amount": 100, "from_currency": "USD", "to_currency": "EUR"}' \
-H "Content-Type: application/json"
```

---

## Configuration

### Frontend Configuration
- Modify the `vite.config.ts` file to customize the development server settings:
  ```typescript
  server: {
    port: 4321, // Change port if needed
    strictPort: true,
    open: true,
  }
  ```

### Backend Configuration
- API endpoints are defined in various Flask handlers, such as:
  - `handlers/data_transfer_handlers.py`
  - `handlers/angle_handlers.py`
  - `handlers/frequency_handlers.py`

Ensure the Flask server is running on the correct port (`5000` by default).

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## Acknowledgments

Special thanks to **PierrunoYT** for building this versatile and powerful conversion tool. 🚀