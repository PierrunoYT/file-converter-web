from flask import jsonify
import math

def convert_angle(value, from_unit, to_unit):
    # Base unit: Radians
    conversion_factors = {
        'radians': 1,
        'degrees': math.pi/180,
        'gradians': math.pi/200,
        'turns': 2 * math.pi,
        'minutes': math.pi/(180 * 60),  # arc minutes
        'seconds': math.pi/(180 * 3600)  # arc seconds
    }
    
    try:
        value = float(value)
        # Convert to base unit (radians)
        base_value = value * (1/conversion_factors[from_unit])
        # Convert from base unit to target unit
        result = base_value * conversion_factors[to_unit]
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
        }), 400