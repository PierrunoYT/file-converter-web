from flask import jsonify

def convert_pressure(value, from_unit, to_unit):
    # Base conversion to pascals
    base_rates = {
        'pa': 1,
        'kpa': 1000,
        'mpa': 1000000,
        'bar': 100000,
        'psi': 6894.76,
        'atm': 101325,
        'mmhg': 133.322,
        'inhg': 3386.39
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (pascals)
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
