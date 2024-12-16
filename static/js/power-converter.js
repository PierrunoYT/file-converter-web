// Conversion factors to Watts
const powerConversions = {
    'W': 1,
    'kW': 1000,
    'hp': 745.7,
    'BTU': 0.29307107,
    'mW': 1000000
};

function convertPower() {
    const value = parseFloat(document.getElementById('value').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (isNaN(value)) {
        document.getElementById('result').textContent = 'Please enter a valid number';
        return;
    }

    // Convert to watts first
    const watts = value * powerConversions[fromUnit];
    
    // Convert from watts to target unit
    const result = watts / powerConversions[toUnit];
    
    // Format the result to a reasonable number of decimal places
    const formattedResult = result.toFixed(4).replace(/\.?0+$/, '');
    
    document.getElementById('result').textContent = `${formattedResult} ${toUnit}`;
}

// Add event listeners for real-time conversion
document.getElementById('value').addEventListener('input', convertPower);
document.getElementById('fromUnit').addEventListener('change', convertPower);
document.getElementById('toUnit').addEventListener('change', convertPower);
