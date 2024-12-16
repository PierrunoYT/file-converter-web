from flask import jsonify

def convert_speed(value, from_unit, to_unit):
    # Base conversion to meters per second
    base_rates = {
        'mps': 1,
        'kph': 0.277778,
        'mph': 0.44704,
        'knot': 0.514444,
        'fps': 0.3048
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (meters per second)
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
