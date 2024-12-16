document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    const resultContainer = document.querySelector('.result-container');
    const downloadBtn = document.querySelector('.download-btn');

    let selectedFile = null;

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        handleFileSelection(file);
    });

    // File input handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileSelection(file);
    });

    function handleFileSelection(file) {
        if (!file) return;

        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/ogg'];
        const fileType = file.type;

        if (!validTypes.includes(fileType)) {
            alert('Please select a valid audio file (MP3, WAV, AAC, FLAC, or OGG)');
            return;
        }

        selectedFile = file;
        dropZone.querySelector('p').textContent = `Selected: ${file.name}`;
        convertBtn.disabled = false;
    }

    // Convert button handler
    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const targetFormat = document.getElementById('targetFormat').value;

        // Show progress
        progressContainer.style.display = 'block';
        convertBtn.disabled = true;

        // Prepare form data
        const formData = new FormData();
        formData.append('audio', selectedFile);
        formData.append('format', targetFormat);
        formData.append('filename', selectedFile.name.split('.')[0]);

        try {
            // Simulate conversion progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 100) progress = 100;
                
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;

                if (progress === 100) {
                    clearInterval(progressInterval);
                    showResult();
                }
            }, 500);

            // Send to backend
            const response = await fetch('/convert/audio', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // Update download button
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted_audio.${targetFormat}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during conversion. Please try again.');
            resetUI();
        }
    });

    function showResult() {
        resultContainer.style.display = 'block';
    }

    function resetUI() {
        progressContainer.style.display = 'none';
        resultContainer.style.display = 'none';
        convertBtn.disabled = true;
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        dropZone.querySelector('p').textContent = 'Drag & Drop your audio file here';
        selectedFile = null;
    }

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
});
