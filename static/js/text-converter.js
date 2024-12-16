document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const formatSelect = document.getElementById('formatSelect');
    const convertBtn = document.getElementById('convertBtn');
    const previewGrid = document.getElementById('previewGrid');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.getElementById('progress');
    const progressText = document.querySelector('.progress-text');
    const dropZone = document.getElementById('dropZone');

    let files = [];

    // Drag and drop handling
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        document.body.addEventListener(eventName, () => {
            dropZone.classList.add('active');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, () => {
            dropZone.classList.remove('active');
        });
    });

    document.body.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    formatSelect.addEventListener('change', updateConvertButton);
    convertBtn.addEventListener('click', handleConversion);

    function handleDrop(e) {
        const droppedFiles = [...e.dataTransfer.files];
        handleFiles(droppedFiles);
    }

    function handleFileSelect(e) {
        const selectedFiles = [...e.target.files];
        handleFiles(selectedFiles);
    }

    function handleFiles(newFiles) {
        const validFiles = newFiles.filter(file => {
            const validExtensions = ['.txt', '.doc', '.docx', '.pdf', '.rtf', '.odt', '.md'];
            const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
            const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
            
            if (!isValidExtension) {
                alert(`Invalid file type: ${file.name}\nPlease upload valid text documents (TXT, DOC, DOCX, PDF, RTF, ODT, MD)`);
                return false;
            }
            
            if (!isValidSize) {
                alert(`File too large: ${file.name}\nMaximum file size is 100MB`);
                return false;
            }
            
            return true;
        });

        if (validFiles.length === 0) {
            return;
        }

        files = [...files, ...validFiles];
        updatePreview();
        updateConvertButton();
    }

    function updatePreview() {
        previewGrid.innerHTML = '';
        files.forEach((file, index) => {
            const preview = createPreviewElement(file, index);
            previewGrid.appendChild(preview);
        });
    }

    function createPreviewElement(file, index) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        const textInfo = document.createElement('div');
        textInfo.className = 'text-info';

        const icon = document.createElement('i');
        icon.className = 'text-icon fas fa-file-text';

        const name = document.createElement('span');
        name.className = 'text-name';
        name.textContent = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeFile(index);

        const preview = document.createElement('div');
        preview.className = 'text-preview';
        
        // Read and display preview for text files and markdown
        if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.md')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.textContent = e.target.result.slice(0, 200) + '...';
            };
            reader.readAsText(file);
        } else {
            preview.textContent = `${file.type || file.name.split('.').pop().toUpperCase()} document - Preview not available`;
        }

        textInfo.appendChild(icon);
        textInfo.appendChild(name);
        previewItem.appendChild(textInfo);
        previewItem.appendChild(removeBtn);
        previewItem.appendChild(preview);

        return previewItem;
    }

    function removeFile(index) {
        files.splice(index, 1);
        updatePreview();
        updateConvertButton();
    }

    function updateConvertButton() {
        convertBtn.disabled = files.length === 0 || !formatSelect.value;
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
    }

    async function handleConversion() {
        if (files.length === 0) return;

        const targetFormat = formatSelect.value;
        progressContainer.style.display = 'block';
        convertBtn.disabled = true;

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('target_format', targetFormat);

                const percent = Math.round((i / files.length) * 100);
                updateProgress(percent);

                const response = await fetch('/convert/text', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Failed to convert ${file.name}`);
                }

                const blob = await response.blob();
                const fileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.' + targetFormat;
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }

            updateProgress(100);
            setTimeout(() => {
                progressContainer.style.display = 'none';
                files = [];
                updatePreview();
                updateConvertButton();
                alert('Conversion completed successfully!');
            }, 1000);
        } catch (error) {
            console.error('Conversion error:', error);
            alert('Error during conversion. Please try again.');
        } finally {
            convertBtn.disabled = false;
        }
    }
});
