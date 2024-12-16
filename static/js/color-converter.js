document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('colorInput');
    const fromFormat = document.getElementById('fromFormat');
    const convertBtn = document.getElementById('convertBtn');
    const errorMessage = document.getElementById('errorMessage');
    const colorPreview = document.getElementById('colorPreview');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Regular expressions for validation
    const validators = {
        hex: /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/,
        cmyk: /^cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/
    };

    // Conversion functions
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b];
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(l * 100)
        ];
    }

    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    function rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) {
            c = m = y = 0;
        } else {
            c = (c - k) / (1 - k);
            m = (m - k) / (1 - k);
            y = (y - k) / (1 - k);
        }

        return [
            Math.round(c * 100),
            Math.round(m * 100),
            Math.round(y * 100),
            Math.round(k * 100)
        ];
    }

    function cmykToRgb(c, m, y, k) {
        c /= 100;
        m /= 100;
        y /= 100;
        k /= 100;

        const r = Math.round(255 * (1 - c) * (1 - k));
        const g = Math.round(255 * (1 - m) * (1 - k));
        const b = Math.round(255 * (1 - y) * (1 - k));

        return [r, g, b];
    }

    function validateColor(color, format) {
        return validators[format].test(color);
    }

    function parseColor(color, format) {
        switch (format) {
            case 'hex':
                return hexToRgb(color);
            case 'rgb': {
                const rgbMatch = color.match(/\d+/g);
                return rgbMatch.map(Number);
            }
            case 'hsl': {
                const [h, s, l] = color.match(/\d+/g).map(Number);
                return hslToRgb(h, s, l);
            }
            case 'cmyk': {
                const [c, m, y, k] = color.match(/\d+/g).map(Number);
                return cmykToRgb(c, m, y, k);
            }
        }
    }

    function updateResults(rgb) {
        const [r, g, b] = rgb;
        const hex = rgbToHex(r, g, b);
        const hsl = rgbToHsl(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        document.getElementById('hexResult').textContent = hex;
        document.getElementById('rgbResult').textContent = `rgb(${r}, ${g}, ${b})`;
        document.getElementById('hslResult').textContent = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
        document.getElementById('cmykResult').textContent = `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;

        colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Event handlers
    convertBtn.addEventListener('click', () => {
        hideError();
        const color = colorInput.value.trim();
        const format = fromFormat.value;

        if (!color) {
            showError('Please enter a color value');
            return;
        }

        if (!validateColor(color, format)) {
            showError('Invalid color format');
            return;
        }

        const rgb = parseColor(color, format);
        updateResults(rgb);
    });

    // Copy button handlers
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const format = button.dataset.format;
            const result = document.getElementById(`${format}Result`).textContent;
            navigator.clipboard.writeText(result).then(() => {
                const icon = button.querySelector('i');
                icon.className = 'fas fa-check';
                setTimeout(() => {
                    icon.className = 'fas fa-copy';
                }, 2000);
            });
        });
    });

    // Initial conversion on input
    colorInput.addEventListener('input', () => {
        if (colorInput.value.trim()) {
            convertBtn.click();
        }
    });
});
