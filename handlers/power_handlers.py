from flask import jsonify

def convert_power(value, from_unit, to_unit):
    # Base conversion to watts
    base_rates = {
        'w': 1,
        'kw': 1000,
        'mw': 1000000,
        'hp': 745.7,
        'btu_h': 0.29307107,
        'ft_lb_s': 1.355818
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (watts)
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
