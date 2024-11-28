document.addEventListener('DOMContentLoaded', () => {
    // Get all converter cards
    const converterCards = document.querySelectorAll('.converter-card');

    // Add click event listeners to each card
    converterCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            handleConverterSelection(type);
        });

        // Add hover effect for better UX
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Handle converter type selection
    function handleConverterSelection(type) {
        // Store the selected converter type
        localStorage.setItem('selectedConverter', type);

        // Add a nice animation before navigation
        const card = document.querySelector(`[data-type="${type}"]`);
        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
            card.style.transform = 'scale(1)';
            // Navigate to the appropriate converter page based on type
            switch(type) {
                case 'image':
                    window.location.href = '/image-converter';
                    break;
                case 'audio':
                    window.location.href = '/audio-converter';
                    break;
                case 'video':
                    window.location.href = '/video-converter';
                    break;
                case 'text':
                    window.location.href = '/text-converter';
                    break;
                default:
                    console.error('Unknown converter type');
            }
        }, 200);
    }

    // Add button click handlers
    const convertButtons = document.querySelectorAll('.convert-btn');
    convertButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event
            const card = button.closest('.converter-card');
            const type = card.dataset.type;
            handleConverterSelection(type);
        });
    });

    // Add some subtle animation when the page loads
    setTimeout(() => {
        converterCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);

    // Initialize cards with starting styles for animation
    converterCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease-out';
    });
});