from flask import send_file, request, render_template, g
from extensions import limiter
from handlers.image_handlers import handle_image_conversion
from handlers.audio_handlers import handle_audio_conversion
from handlers.video_handlers import handle_video_conversion
from handlers.text_handlers import handle_text_conversion
from handlers.data_transfer_handlers import convert_data_transfer_rate
from handlers.frequency_handlers import convert_frequency
from handlers.time_handlers import convert_time
from handlers.weight_handlers import convert_weight
from handlers.length_handlers import convert_length
from handlers.volume_handlers import convert_volume
from handlers.temperature_handlers import convert_temperature
from handlers.currency_handlers import convert_currency
from handlers.speed_handlers import convert_speed
from handlers.filesize_handlers import convert_filesize
from handlers.electrical_handlers import convert_voltage, convert_current, convert_resistance
from handlers.power_handlers import convert_power
from handlers.area_handlers import convert_area
from handlers.pressure_handlers import convert_pressure
from handlers.color_handlers import convert_color
from handlers.energy_handlers import convert_energy
from handlers.angle_handlers import convert_angle

def setup_routes(app):
    """Setup all route handlers for the Flask application."""
    
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    @app.route('/image-converter')
    def image_converter():
        return app.send_static_file('image-converter.html')

    @app.route('/audio-converter')
    def audio_converter():
        return app.send_static_file('audio-converter.html')

    @app.route('/video-converter')
    def video_converter():
        return app.send_static_file('video-converter.html')

    @app.route('/text-converter')
    def text_converter():
        return app.send_static_file('text-converter.html')

    @app.route('/time-converter')
    def time_converter():
        return app.send_static_file('time-converter.html')

    @app.route('/weight-converter')
    def weight_converter():
        return app.send_static_file('weight-converter.html')
    
    @app.route('/length-converter')
    def length_converter():
        return app.send_static_file('length-converter.html')
    
    @app.route('/volume-converter')
    def volume_converter():
        return app.send_static_file('volume-converter.html')
    
    @app.route('/temperature-converter')
    def temperature_converter():
        return app.send_static_file('temperature-converter.html')
    
    @app.route('/currency-converter')
    def currency_converter():
        return app.send_static_file('currency-converter.html')

    @app.route('/speed-converter')
    def speed_converter():
        return app.send_static_file('speed-converter.html')

    @app.route('/electrical-converter')
    def electrical_converter():
        return app.send_static_file('electrical-converter.html')

    @app.route('/filesize-converter')
    def filesize_converter():
        return app.send_static_file('filesize-converter.html')

    @app.route('/area-converter')
    def area_converter():
        return app.send_static_file('area-converter.html')

    @app.route('/pressure-converter')
    def pressure_converter():
        return app.send_static_file('pressure-converter.html')

    @app.route('/color-converter')
    def color_converter():
        return app.send_static_file('color-converter.html')

    @app.route('/power-converter')
    def power_converter():
        return app.send_static_file('power-converter.html')

    @app.route('/data-transfer-converter')
    def data_transfer_converter():
        return app.send_static_file('data_transfer_converter.html')

    @app.route('/frequency-converter')
    def frequency_converter():
        return app.send_static_file('frequency_converter.html')

    @app.route('/energy-converter')
    def energy_converter():
        return app.send_static_file('energy-converter.html')

    @app.route('/angle-converter')
    def angle_converter():
        return app.send_static_file('angle-converter.html')

    # Exempt static files from rate limiting using before_request
    @app.before_request
    def exempt_static_from_limit():
        if request.path.startswith('/static/'):
            g._exempt_from_limiter = True

    @app.route('/convert/text', methods=['POST'])
    def handle_text_route():
        return handle_text_conversion(request)

    @app.route('/convert/image', methods=['POST'])
    def handle_image_route():
        return handle_image_conversion(request)

    @app.route('/convert/audio', methods=['POST'])
    def handle_audio_route():
        return handle_audio_conversion(request)

    @app.route('/convert/video', methods=['POST'])
    def handle_video_route():
        return handle_video_conversion(request)

    @app.route('/convert/data_transfer', methods=['POST'])
    def handle_data_transfer_conversion():
        data = request.get_json()
        value = data.get('value')
        from_unit = data.get('from_unit')
        to_unit = data.get('to_unit')
        return convert_data_transfer_rate(value, from_unit, to_unit)

    @app.route('/convert/frequency', methods=['POST'])
    def handle_frequency_conversion():
        data = request.get_json()
        value = data.get('value')
        from_unit = data.get('from_unit')
        to_unit = data.get('to_unit')
        return convert_frequency(value, from_unit, to_unit)

    @app.route('/convert/time', methods=['POST'])
    def time_conversion():
        data = request.get_json()
        return convert_time(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/weight', methods=['POST'])
    def weight_conversion():
        data = request.get_json()
        return convert_weight(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/length', methods=['POST'])
    def length_conversion():
        data = request.get_json()
        return convert_length(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/volume', methods=['POST'])
    def volume_conversion():
        data = request.get_json()
        return convert_volume(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/temperature', methods=['POST'])
    def temperature_conversion():
        data = request.get_json()
        return convert_temperature(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/currency', methods=['POST'])
    def currency_conversion():
        data = request.get_json()
        return convert_currency(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/speed', methods=['POST'])
    def speed_conversion():
        data = request.get_json()
        return convert_speed(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/filesize', methods=['POST'])
    def filesize_conversion():
        data = request.get_json()
        return convert_filesize(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/voltage', methods=['POST'])
    def voltage_conversion():
        data = request.get_json()
        return convert_voltage(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/current', methods=['POST'])
    def current_conversion():
        data = request.get_json()
        return convert_current(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/resistance', methods=['POST'])
    def resistance_conversion():
        data = request.get_json()
        return convert_resistance(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/power', methods=['POST'])
    def power_conversion():
        data = request.get_json()
        return convert_power(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/area', methods=['POST'])
    def area_conversion():
        data = request.get_json()
        return convert_area(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/pressure', methods=['POST'])
    def pressure_conversion():
        data = request.get_json()
        return convert_pressure(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/convert/color', methods=['POST'])
    def handle_color_conversion():
        data = request.get_json()
        value = data.get('value')
        from_format = data.get('from_format')
        to_format = data.get('to_format')
        return convert_color(value, from_format, to_format)

    @app.route('/api/convert/energy', methods=['POST'])
    def energy_conversion():
        data = request.get_json()
        return convert_energy(data['value'], data['from_unit'], data['to_unit'])

    @app.route('/api/convert/angle', methods=['POST'])
    def angle_conversion():
        data = request.get_json()
        return convert_angle(data['value'], data['from_unit'], data['to_unit'])
