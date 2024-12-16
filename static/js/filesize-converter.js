document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const convertButton = document.getElementById('convert-button');
    const resultDisplay = document.getElementById('result');

    // Conversion factors (to bytes)
    const unitFactors = {
        'B': 1,
        'KB': 1000,
        'MB': 1000 * 1000,
        'GB': 1000 * 1000 * 1000,
        'TB': 1000 * 1000 * 1000 * 1000,
        'PB': 1000 * 1000 * 1000 * 1000 * 1000,
        'KiB': 1024,
        'MiB': 1024 * 1024,
        'GiB': 1024 * 1024 * 1024,
        'TiB': 1024 * 1024 * 1024 * 1024,
        'PiB': 1024 * 1024 * 1024 * 1024 * 1024
    };

    function convertFileSize(amount, fromUnit, toUnit) {
        // Convert to bytes first
        const bytes = amount * unitFactors[fromUnit];
        // Then convert from bytes to target unit
        return bytes / unitFactors[toUnit];
    }

    function formatNumber(value) {
        if (value === 0) return '0';
        
        // For very small numbers (less than 0.000001), use scientific notation
        if (Math.abs(value) < 0.000001) {
            return value.toExponential(6);
        }
        
        // For regular numbers, format with appropriate decimal places
        if (Math.abs(value) < 0.01) {
            return value.toFixed(6);
        } else if (Math.abs(value) < 1) {
            return value.toFixed(4);
        } else if (Math.abs(value) < 100) {
            return value.toFixed(3);
        } else {
            // For larger numbers, use toLocaleString for thousands separators
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
    }

    function updateResult() {
        const amount = parseFloat(amountInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (isNaN(amount)) {
            resultDisplay.textContent = 'Please enter a valid number';
            resultDisplay.classList.remove('active');
            return;
        }

        const result = convertFileSize(amount, fromUnit, toUnit);
        resultDisplay.textContent = `${amount.toLocaleString()} ${fromUnit} = ${formatNumber(result)} ${toUnit}`;
        resultDisplay.classList.add('active');
    }

    // Event listeners
    convertButton.addEventListener('click', updateResult);

    // Also convert when pressing Enter in the amount input
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateResult();
        }
    });
});
