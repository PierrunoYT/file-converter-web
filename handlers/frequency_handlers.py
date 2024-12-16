from flask import jsonify

def convert_frequency(value, from_unit, to_unit):
    # Base conversion to Hertz (Hz)
    base_rates = {
        'hz': 1,
        'khz': 1000,
        'mhz': 1000000,
        'ghz': 1000000000,
        'rpm': 1/60  # 1 RPM = 1/60 Hz
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (Hz)
        base_value = value * base_rates[from_unit.lower()]
        
        # Convert from base unit to target unit
        result = base_value / base_rates[to_unit.lower()]
        
        return jsonify({
            'success': True,
            'result': result,
            'from_unit': from_unit,
            'to_unit': to_unit
        })
    except (ValueError, KeyError) as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })
