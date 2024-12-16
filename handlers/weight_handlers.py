from flask import jsonify

def convert_weight(value, from_unit, to_unit):
    # Base conversion to grams
    base_rates = {
        'kg': 1000,
        'g': 1,
        'mg': 0.001,
        'lb': 453.59237,
        'oz': 28.349523125,
        't': 1000000  # metric ton
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (grams)
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
