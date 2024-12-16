// Conversion factors to Hz
const CONVERSION_FACTORS = {
    'hz': 1,
    'khz': 1000,
    'mhz': 1000000,
    'ghz': 1000000000,
    'rpm': 1/60  // 1 RPM = 1/60 Hz
};

function convertFrequency() {
    const inputValue = document.getElementById('frequency-value').value;
    const fromUnit = document.getElementById('frequency-from').value;
    const toUnit = document.getElementById('frequency-to').value;
    const resultElement = document.getElementById('frequency-result');

    // Input validation
    if (!inputValue || isNaN(inputValue)) {
        resultElement.textContent = 'Please enter a valid number';
        resultElement.classList.add('error');
        return;
    }

    // Convert to base unit (Hz) first, then to target unit
    const valueInHz = parseFloat(inputValue) * CONVERSION_FACTORS[fromUnit];
    const result = valueInHz / CONVERSION_FACTORS[toUnit];

    // Format the result based on its magnitude
    let formattedResult;
    if (result >= 1e9 || result <= 1e-9) {
        formattedResult = result.toExponential(6);
    } else {
        formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
    }

    resultElement.textContent = `${formattedResult} ${toUnit.toUpperCase()}`;
    resultElement.classList.remove('error');
}

// Add event listeners for real-time conversion
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['frequency-value', 'frequency-from', 'frequency-to'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', convertFrequency);
    });
});

// Handle Enter key press
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        convertFrequency();
    }
});