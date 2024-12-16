document.addEventListener('DOMContentLoaded', () => {
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const result = document.getElementById('result');
    const convertBtn = document.getElementById('convertBtn');

    // Conversion rates to meters (base unit)
    const toMeters = {
        km: 1000,          // 1 kilometer = 1000 meters
        m: 1,              // base unit
        cm: 0.01,          // 1 centimeter = 0.01 meters
        mm: 0.001,         // 1 millimeter = 0.001 meters
        mi: 1609.344,      // 1 mile = 1609.344 meters
        yd: 0.9144,        // 1 yard = 0.9144 meters
        ft: 0.3048,        // 1 foot = 0.3048 meters
        in: 0.0254,        // 1 inch = 0.0254 meters
        nmi: 1852          // 1 nautical mile = 1852 meters
    };

    // Conversion rates from meters to other units
    const fromMeters = {
        km: 0.001,         // 1 meter = 0.001 kilometers
        m: 1,              // base unit
        cm: 100,           // 1 meter = 100 centimeters
        mm: 1000,          // 1 meter = 1000 millimeters
        mi: 0.000621371,   // 1 meter = 0.000621371 miles
        yd: 1.09361,       // 1 meter = 1.09361 yards
        ft: 3.28084,       // 1 meter = 3.28084 feet
        in: 39.3701,       // 1 meter = 39.3701 inches
        nmi: 0.000539957   // 1 meter = 0.000539957 nautical miles
    };

    function convert() {
        if (!fromValue.value) {
            toValue.value = '';
            result.textContent = 'Enter a value to convert';
            return;
        }

        const inputValue = parseFloat(fromValue.value);
        const from = fromUnit.value;
        const to = toUnit.value;

        // Convert to meters first (our base unit)
        const meterValue = inputValue * toMeters[from];
        // Then convert from meters to target unit
        const resultValue = meterValue * fromMeters[to];

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

    function handleConvertClick() {
        convert();
        // Add animation effect to result
        result.style.transform = 'scale(1.05)';
        setTimeout(() => {
            result.style.transform = 'scale(1)';
        }, 200);
    }

    // Add event listener for button click
    convertBtn.addEventListener('click', handleConvertClick);

    // Add transition for animation
    result.style.transition = 'transform 0.2s ease';

    // Initial conversion
    convert();
});
