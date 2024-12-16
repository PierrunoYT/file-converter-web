from flask import jsonify
from datetime import datetime
import pytz

def convert_time(value, from_timezone, to_timezone):
    try:
        # Parse the input time
        dt = datetime.fromisoformat(value)
        
        # Set the source timezone
        source_tz = pytz.timezone(from_timezone)
        dt = source_tz.localize(dt)
        
        # Convert to target timezone
        target_tz = pytz.timezone(to_timezone)
        converted_time = dt.astimezone(target_tz)
        
        return jsonify({
            'success': True,
            'result': converted_time.isoformat(),
            'from_timezone': from_timezone,
            'to_timezone': to_timezone
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })
