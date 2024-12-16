document.addEventListener('DOMContentLoaded', () => {
    // Get all converter cards
    const converterCards = document.querySelectorAll('.converter-card');
    const converterTypes = {
        image: '/image-converter',
        audio: '/audio-converter', 
        video: '/video-converter',
        text: '/text-converter',
        time: '/time-converter',
        weight: '/weight-converter',
        length: '/length-converter',
        volume: '/volume-converter',
        temperature: '/temperature-converter',
        currency: '/currency-converter',
        speed: '/speed-converter',
        electrical: '/electrical-converter',
        filesize: '/filesize-converter',
        area: '/area-converter',
        pressure: '/pressure-converter',
        power: '/power-converter',
        'data-transfer': '/data-transfer-converter',
        frequency: '/frequency-converter',
        color: '/color-converter',
        energy: '/energy-converter',
        angle: '/angle-converter'
    };

    // Error handling function
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // Initialize cards with starting styles for animation
    converterCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add hover effects with smooth transition
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });

        // Add click handler with error handling
        card.addEventListener('click', () => {
            try {
                const type = card.dataset.type;
                console.log('Clicked converter type:', type);
                console.log('Available routes:', converterTypes);
                console.log('Target route:', converterTypes[type]);
                handleConverterSelection(type);
            } catch (error) {
                showError('Error navigating to converter');
                console.error('Navigation error:', error);
            }
        });
    });

    // Handle converter type selection with improved error handling
    function handleConverterSelection(type) {
        console.log('Handling converter selection for type:', type);
        if (!converterTypes[type]) {
            showError('Invalid converter type selected');
            console.error('Unknown converter type:', type);
            return;
        }
        console.log('Found route:', converterTypes[type]);

        try {
            // Store the selected converter type
            localStorage.setItem('selectedConverter', type);

            // Navigate immediately
            window.location.href = converterTypes[type];
        } catch (error) {
            showError('Error navigating to converter');
            console.error('Navigation error:', error);
        }
    }

    // Add button click handlers with improved error handling
    const convertButtons = document.querySelectorAll('.convert-btn');
    convertButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            try {
                e.preventDefault();
                e.stopPropagation();
                
                const card = button.closest('.converter-card');
                if (!card) {
                    showError('Could not find converter card');
                    return;
                }

                const type = card.dataset.type;
                if (!type) {
                    showError('No converter type specified');
                    return;
                }

                handleConverterSelection(type);
            } catch (error) {
                showError('Error processing request');
                console.error('Button click error:', error);
            }
        });
    });

    // Animate cards on page load with improved timing and intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(converterCards).indexOf(card);
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50 + (index * 50));
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.1
    });

    converterCards.forEach(card => observer.observe(card));

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
