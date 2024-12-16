document.addEventListener('DOMContentLoaded', () => {
    const fromValue = document.getElementById('fromValue');
    const resultValue = document.getElementById('toValue');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const convertBtn = document.getElementById('convertBtn');

    // Function to perform the conversion
    async function convertAngle() {
        if (!fromValue.value) {
            toValue.value = '';
            return;
        }

        try {
            const response = await fetch('/api/convert/angle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: fromValue.value,
                    from_unit: fromUnit.value,
                    to_unit: toUnit.value
                })
            });

            const data = await response.json();

            if (data.success) {
                // Format the result based on its magnitude
                let result = parseFloat(data.result);
                let formattedResult;
                if (Math.abs(result) < 0.000001 || Math.abs(result) > 999999999) {
                    formattedResult = result.toExponential(6);
                } else {
                    formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
                }
                resultValue.textContent = `${formattedResult} ${toUnit.options[toUnit.selectedIndex].text}`;
            } else {
                resultValue.textContent = 'Error';
                console.error('Conversion error:', data.error);
            }
        } catch (error) {
            resultValue.textContent = 'Error';
            console.error('API error:', error);
        }
    }

    // Event listener for convert button
    convertBtn.addEventListener('click', convertAngle);

    // Initialize with default values
    fromUnit.value = 'degrees';
    toUnit.value = 'radians';
    resultValue.textContent = 'Result will appear here';
});