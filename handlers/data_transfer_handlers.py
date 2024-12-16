from flask import jsonify
import requests

def convert_data_transfer_rate(value, from_unit, to_unit):
    # Base conversion to bits per second (bps)
    base_rates = {
        'bps': 1,
        'kbps': 1000,
        'mbps': 1000000,
        'gbps': 1000000000,
        'B/s': 8,
        'KB/s': 8000,
        'MB/s': 8000000,
        'GB/s': 8000000000
    }
    
    try:
        # Convert input to float
        value = float(value)
        
        # Convert to base unit (bps)
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

def convert_currency(amount, from_currency, to_currency):
    try:
        # Convert input to float
        amount = float(amount)
        
        # Make API request to Frankfurter
        url = f'https://api.frankfurter.app/latest?amount={amount}&from={from_currency}&to={to_currency}'
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            converted_amount = data['rates'][to_currency]
            return jsonify({
                'success': True,
                'result': converted_amount,
                'from': from_currency,
                'to': to_currency
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to fetch exchange rates'
            })
            
    except ValueError:
        return jsonify({
            'success': False,
            'error': 'Invalid amount provided'
        })
    except KeyError:
        return jsonify({
            'success': False,
            'error': 'Invalid currency code'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })
