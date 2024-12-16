from flask import jsonify

def convert_energy(value, from_unit, to_unit):
    # Base unit: Joules
    conversion_factors = {
        'joules': 1,
        'kilojoules': 1000,
        'calories': 4.184,
        'kilocalories': 4184,
        'watt_hours': 3600,
        'kilowatt_hours': 3600000,
        'electron_volts': 1.602176634e-19,
        'british_thermal_units': 1055.06,
        'foot_pounds': 1.355818
    }
    
    try:
        value = float(value)
        # Convert to base unit (Joules)
        base_value = value * conversion_factors[from_unit]
        # Convert from base unit to target unit
        result = base_value / conversion_factors[to_unit]
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