document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const convertButton = document.getElementById('convert-button');
    const resultDisplay = document.getElementById('result');

    // Conversion factors (to Pascal)
    const unitFactors = {
        'Pa': 1,                    // Pascal (base unit)
        'kPa': 1000,               // Kilopascal
        'MPa': 1000000,            // Megapascal
        'bar': 100000,             // Bar
        'psi': 6894.76,            // Pounds per Square Inch
        'atm': 101325,             // Standard Atmosphere
        'torr': 133.322,           // Torr
        'mmHg': 133.322,           // Millimeters of Mercury
        'inHg': 3386.39,           // Inches of Mercury
        'mbar': 100                // Millibar
    };

    function convertPressure(amount, fromUnit, toUnit) {
        // Convert to Pascal first
        const pascals = amount * unitFactors[fromUnit];
        // Then convert from Pascal to target unit
        return pascals / unitFactors[toUnit];
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

        const result = convertPressure(amount, fromUnit, toUnit);
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
