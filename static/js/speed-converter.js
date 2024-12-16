document.addEventListener('DOMContentLoaded', () => {
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const result = document.getElementById('result');
    const convertBtn = document.getElementById('convertBtn');
    const errorMessage = document.getElementById('errorMessage');

    // Conversion rates to meters per second (base unit)
    const toMPS = {
        mps: 1,           // base unit
        kph: 0.277778,    // 1 km/h = 0.277778 m/s
        mph: 0.44704,     // 1 mph = 0.44704 m/s
        fps: 0.3048,      // 1 ft/s = 0.3048 m/s
        knot: 0.514444    // 1 knot = 0.514444 m/s
    };

    // Conversion rates from meters per second to other units
    const fromMPS = {
        mps: 1,           // base unit
        kph: 3.6,         // 1 m/s = 3.6 km/h
        mph: 2.236936,    // 1 m/s = 2.236936 mph
        fps: 3.28084,     // 1 m/s = 3.28084 ft/s
        knot: 1.943844    // 1 m/s = 1.943844 knots
    };

    function convert() {
        errorMessage.style.display = 'none';

        if (!fromValue.value) {
            toValue.value = '';
            result.textContent = 'Enter a value to convert';
            return;
        }

        const inputValue = parseFloat(fromValue.value);

        // Input validation
        if (isNaN(inputValue)) {
            showError('Please enter a valid number');
            return;
        }

        if (inputValue < 0) {
            showError('Speed cannot be negative');
            return;
        }

        if (inputValue > 1e9) {
            showError('Value is too large');
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;

        // Convert to meters per second first (our base unit)
        const mpsValue = inputValue * toMPS[from];
        // Then convert from meters per second to target unit
        const resultValue = mpsValue * fromMPS[to];

        // Format the result based on the magnitude
        let formattedResult;
        if (Math.abs(resultValue) >= 1000000) {
            formattedResult = resultValue.toExponential(6);
        } else if (Math.abs(resultValue) < 0.000001) {
            formattedResult = resultValue.toExponential(6);
        } else {
            formattedResult = resultValue.toFixed(6);
        }

        // Update the result input and display
        toValue.value = formattedResult;
        result.textContent = `${inputValue} ${from} = ${formattedResult} ${to}`;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        toValue.value = '';
        result.textContent = 'Error';
    }

    function handleConvertClick() {
        convert();
        // Add animation effect to result
        result.style.transform = 'scale(1.05)';
        setTimeout(() => {
            result.style.transform = 'scale(1)';
        }, 200);
    }

    // Add event listeners
    convertBtn.addEventListener('click', handleConvertClick);
    
    // Add keyboard support
    fromValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleConvertClick();
        }
    });

    // Add change event listeners to trigger conversion
    fromValue.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);

    // Add transition for animation
    result.style.transition = 'transform 0.2s ease';

    // Initial conversion
    convert();
});
