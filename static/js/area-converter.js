document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const convertButton = document.getElementById('convert-button');
    const resultDisplay = document.getElementById('result');

    // Conversion factors (to square meters)
    const unitFactors = {
        'm2': 1,                    // Square Meter (base unit)
        'km2': 1000000,            // Square Kilometer
        'cm2': 0.0001,             // Square Centimeter
        'mm2': 0.000001,           // Square Millimeter
        'ha': 10000,               // Hectare
        'ft2': 0.092903,           // Square Foot
        'in2': 0.00064516,         // Square Inch
        'yd2': 0.836127,           // Square Yard
        'ac': 4046.86,             // Acre
        'mi2': 2589988.11         // Square Mile
    };

    function convertArea(amount, fromUnit, toUnit) {
        // Convert to square meters first
        const squareMeters = amount * unitFactors[fromUnit];
        // Then convert from square meters to target unit
        return squareMeters / unitFactors[toUnit];
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

        const result = convertArea(amount, fromUnit, toUnit);
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
