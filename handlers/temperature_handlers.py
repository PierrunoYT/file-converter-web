from flask import jsonify

def convert_temperature(value, from_unit, to_unit):
    try:
        value = float(value)
        result = value  # Default case: same unit
        
        # First convert to Celsius as base
        if from_unit.lower() == 'f':
            value = (value - 32) * 5/9
        elif from_unit.lower() == 'k':
            value = value - 273.15
            
        # Then convert from Celsius to target unit
        if to_unit.lower() == 'f':
            result = (value * 9/5) + 32
        elif to_unit.lower() == 'k':
            result = value + 273.15
        elif to_unit.lower() == 'c':
            result = value
            
        return jsonify({
            'success': True,
            'result': result,
            'from_unit': from_unit,
            'to_unit': to_unit
        })
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })
