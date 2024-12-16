document.addEventListener('DOMContentLoaded', () => {
    const temperatureInput = document.getElementById('temperature');
    const fromUnitSelect = document.getElementById('fromUnit');
    const convertBtn = document.getElementById('convertBtn');
    const errorMessage = document.getElementById('errorMessage');
    const celsiusResult = document.getElementById('celsiusResult');
    const fahrenheitResult = document.getElementById('fahrenheitResult');
    const kelvinResult = document.getElementById('kelvinResult');

    // Conversion functions
    function celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    function celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }

    function fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    function fahrenheitToKelvin(fahrenheit) {
        return (fahrenheit - 32) * 5/9 + 273.15;
    }

    function kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

    function kelvinToFahrenheit(kelvin) {
        return (kelvin - 273.15) * 9/5 + 32;
    }

    // Format the result to a reasonable number of decimal places
    function formatResult(value) {
        return Number(value.toFixed(2));
    }

    // Convert temperature based on input unit
    function convertTemperature(value, fromUnit) {
        let celsius, fahrenheit, kelvin;

        switch(fromUnit) {
            case 'celsius':
                celsius = value;
                fahrenheit = celsiusToFahrenheit(value);
                kelvin = celsiusToKelvin(value);
                break;
            case 'fahrenheit':
                celsius = fahrenheitToCelsius(value);
                fahrenheit = value;
                kelvin = fahrenheitToKelvin(value);
                break;
            case 'kelvin':
                celsius = kelvinToCelsius(value);
                fahrenheit = kelvinToFahrenheit(value);
                kelvin = value;
                break;
            default:
                throw new Error('Invalid unit selected');
        }

        return {
            celsius: formatResult(celsius),
            fahrenheit: formatResult(fahrenheit),
            kelvin: formatResult(kelvin)
        };
    }

    // Handle conversion
    convertBtn.addEventListener('click', () => {
        try {
            errorMessage.style.display = 'none';
            
            const value = parseFloat(temperatureInput.value);
            if (isNaN(value)) {
                throw new Error('Please enter a valid number');
            }

            const fromUnit = fromUnitSelect.value;
            
            // Validate temperature ranges
            switch(fromUnit) {
                case 'celsius':
                    if (value < -273.15) throw new Error('Temperature cannot be below absolute zero (-273.15°C)');
                    if (value > 1e9) throw new Error('Temperature is too high');
                    break;
                case 'fahrenheit':
                    if (value < -459.67) throw new Error('Temperature cannot be below absolute zero (-459.67°F)');
                    if (value > 1.8e9) throw new Error('Temperature is too high');
                    break;
                case 'kelvin':
                    if (value < 0) throw new Error('Temperature cannot be below absolute zero (0K)');
                    if (value > 1e9) throw new Error('Temperature is too high');
                    break;
            }

            const results = convertTemperature(value, fromUnit);

            celsiusResult.textContent = `${results.celsius} °C`;
            fahrenheitResult.textContent = `${results.fahrenheit} °F`;
            kelvinResult.textContent = `${results.kelvin} K`;
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });

    // Handle enter key
    temperatureInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
});
