from flask import jsonify

def convert_area(value, from_unit, to_unit):
    # Base conversion to square meters
    base_rates = {
        'm2': 1,
        'cm2': 0.0001,
        'km2': 1000000,
        'ha': 10000,
        'acre': 4046.86,
        'ft2': 0.092903,
        'in2': 0.00064516,
        'yd2': 0.836127
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (square meters)
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
