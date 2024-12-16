from flask import jsonify
import colorsys

def hex_to_rgb(hex_color):
    """Convert HEX color to RGB."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join(c + c for c in hex_color)
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    """Convert RGB color to HEX."""
    return '#{:02x}{:02x}{:02x}'.format(*rgb)

def rgb_to_hsl(rgb):
    """Convert RGB color to HSL."""
    r, g, b = [x/255.0 for x in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return (round(h * 360), round(s * 100), round(l * 100))

def hsl_to_rgb(hsl):
    """Convert HSL color to RGB."""
    h, s, l = hsl[0]/360.0, hsl[1]/100.0, hsl[2]/100.0
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return tuple(round(x * 255) for x in (r, g, b))

def rgb_to_cmyk(rgb):
    """Convert RGB color to CMYK."""
    r, g, b = [x/255.0 for x in rgb]
    k = 1 - max(r, g, b)
    if k == 1:
        return (0, 0, 0, 100)
    c = (1 - r - k) / (1 - k)
    m = (1 - g - k) / (1 - k)
    y = (1 - b - k) / (1 - k)
    return (round(c * 100), round(m * 100), round(y * 100), round(k * 100))

def cmyk_to_rgb(cmyk):
    """Convert CMYK color to RGB."""
    c, m, y, k = [x/100.0 for x in cmyk]
    r = round(255 * (1 - c) * (1 - k))
    g = round(255 * (1 - m) * (1 - k))
    b = round(255 * (1 - y) * (1 - k))
    return (r, g, b)

def convert_color(value, from_format, to_format):
    """Convert color between different formats."""
    try:
        # First convert to RGB as intermediate format
        if from_format == 'hex':
            rgb = hex_to_rgb(value)
        elif from_format == 'rgb':
            rgb = tuple(map(int, value.split(',')))
        elif from_format == 'hsl':
            h, s, l = map(int, value.split(','))
            rgb = hsl_to_rgb((h, s, l))
        elif from_format == 'cmyk':
            c, m, y, k = map(int, value.split(','))
            rgb = cmyk_to_rgb((c, m, y, k))
        else:
            return jsonify({'error': 'Invalid source format'}), 400

        # Then convert RGB to target format
        if to_format == 'hex':
            result = rgb_to_hex(rgb)
        elif to_format == 'rgb':
            result = ','.join(map(str, rgb))
        elif to_format == 'hsl':
            result = ','.join(map(str, rgb_to_hsl(rgb)))
        elif to_format == 'cmyk':
            result = ','.join(map(str, rgb_to_cmyk(rgb)))
        else:
            return jsonify({'error': 'Invalid target format'}), 400

        return jsonify({
            'success': True,
            'result': result,
            'original_value': value,
            'from_format': from_format,
            'to_format': to_format
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
