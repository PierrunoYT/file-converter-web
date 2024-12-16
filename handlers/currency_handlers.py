from flask import jsonify
import requests

def convert_currency(value, from_currency, to_currency):
    try:
        # Convert input to float
        value = float(value)
        
        # Make API request to Frankfurter
        url = f'https://api.frankfurter.app/latest?amount={value}&from={from_currency}&to={to_currency}'
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            converted_amount = data['rates'][to_currency]
            return jsonify({
                'success': True,
                'result': converted_amount,
                'from_currency': from_currency,
                'to_currency': to_currency
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
