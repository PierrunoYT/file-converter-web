from flask import jsonify

def convert_volume(value, from_unit, to_unit):
    # Base conversion to liters
    base_rates = {
        'l': 1,
        'ml': 0.001,
        'gal': 3.78541,
        'qt': 0.946353,
        'pt': 0.473176,
        'cup': 0.236588,
        'fl_oz': 0.0295735,
        'm3': 1000,
        'cm3': 0.001
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (liters)
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
