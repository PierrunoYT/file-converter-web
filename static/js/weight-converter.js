document.addEventListener('DOMContentLoaded', () => {
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const result = document.getElementById('result');
    const convertBtn = document.getElementById('convertBtn');

    // Conversion rates to kg (base unit)
    const toKg = {
        t: 1000,           // 1 tonne = 1000 kg
        kg: 1,             // base unit
        g: 0.001,          // 1 g = 0.001 kg
        mg: 0.000001,      // 1 mg = 0.000001 kg
        st: 6.35029318,    // 1 stone = 6.35029318 kg
        lb: 0.45359237,    // 1 pound = 0.45359237 kg
        oz: 0.028349523125,// 1 ounce = 0.028349523125 kg
        kt: 0.0002,        // 1 carat = 0.0002 kg
        ztr: 50            // 1 zentner = 50 kg
    };

    // Conversion rates from kg to other units
    const fromKg = {
        t: 0.001,          // 1 kg = 0.001 t
        kg: 1,             // base unit
        g: 1000,           // 1 kg = 1000 g
        mg: 1000000,       // 1 kg = 1000000 mg
        st: 0.157473044,   // 1 kg = 0.157473044 st
        lb: 2.20462262185, // 1 kg = 2.20462262185 lb
        oz: 35.27396195,   // 1 kg = 35.27396195 oz
        kt: 5000,          // 1 kg = 5000 kt (carats)
        ztr: 0.02          // 1 kg = 0.02 ztr
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

        // Convert to kg first (our base unit)
        const kgValue = inputValue * toKg[from];
        // Then convert from kg to target unit
        const resultValue = kgValue * fromKg[to];

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
});
