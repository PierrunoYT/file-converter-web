document.addEventListener('DOMContentLoaded', () => {
    const fromValue = document.getElementById('fromValue');
    const fromUnit = document.getElementById('fromUnit');
    const toValue = document.getElementById('toValue');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');

    // Conversion rates to L (liters)
    const conversionRates = {
        'hl': 100,    // 1 hectoliter = 100 liters
        'l': 1,       // 1 liter = 1 liter (base unit)
        'dl': 0.1,    // 1 deciliter = 0.1 liters
        'cl': 0.01,   // 1 centiliter = 0.01 liters
        'ml': 0.001   // 1 milliliter = 0.001 liters
    };

    function convert() {
        // Clear previous results
        toValue.value = '';
        resultDiv.textContent = '';

        if (!fromValue.value) {
            resultDiv.textContent = 'Please enter a value to convert';
            return;
        }

        const inputValue = parseFloat(fromValue.value);
        if (isNaN(inputValue)) {
            resultDiv.textContent = 'Please enter a valid number';
            return;
        }

        // Convert to base unit (liters)
        const valueInLiters = inputValue * conversionRates[fromUnit.value];
        
        // Convert from base unit to target unit
        const result = valueInLiters / conversionRates[toUnit.value];
        
        // Format the result
        const formattedResult = result.toLocaleString(undefined, {
            maximumFractionDigits: 3,
            minimumFractionDigits: 0
        });

        // Update both displays
        toValue.value = formattedResult;
        resultDiv.textContent = `${formattedResult} ${toUnit.value}`;
    }

    // Add event listeners for button click and Enter key
    convertBtn.addEventListener('click', convert);
    
    // Add keyboard support and input validation
    fromValue.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convert();
        }
    });

    fromValue.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = Math.abs(e.target.value);
        }
    });
});
