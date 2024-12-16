from flask import jsonify

def convert_voltage(value, from_unit, to_unit):
    # Base conversion to volts
    base_rates = {
        'v': 1,
        'kv': 1000,
        'mv': 0.001
    }
    
    try:
        value = float(value)
        base_value = value * base_rates[from_unit.lower()]
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

def convert_current(value, from_unit, to_unit):
    # Base conversion to amperes
    base_rates = {
        'a': 1,
        'ka': 1000,
        'ma': 0.001
    }
    
    try:
        value = float(value)
        base_value = value * base_rates[from_unit.lower()]
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

def convert_resistance(value, from_unit, to_unit):
    # Base conversion to ohms
    base_rates = {
        'ohm': 1,
        'kohm': 1000,
        'mohm': 1000000
    }
    
    try:
        value = float(value)
        base_value = value * base_rates[from_unit.lower()]
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
