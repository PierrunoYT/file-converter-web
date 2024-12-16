// Currency formatting configurations
const CURRENCY_CONFIG = {
    // European currencies with 0 decimal places
    'HUF': { decimals: 0 },
    'ISK': { decimals: 0 },
    
    // European currencies with 2 decimal places
    'EUR': { decimals: 2, symbol: '€' },
    'GBP': { decimals: 2, symbol: '£' },
    'CHF': { decimals: 2 },
    'BGN': { decimals: 2 },
    'DKK': { decimals: 2 },
    'MDL': { decimals: 2 },
    'NOK': { decimals: 2 },
    'PLN': { decimals: 2 },
    'RON': { decimals: 2 },
    'RUB': { decimals: 2 },
    'RSD': { decimals: 2 },
    'CZK': { decimals: 2 },
    'UAH': { decimals: 2 },
    'ALL': { decimals: 2 },
    
    // North American currencies
    'USD': { decimals: 2, symbol: '$' },
    'CAD': { decimals: 2 },
    'MXN': { decimals: 2 },
    
    // Caribbean currencies
    'BSD': { decimals: 2 },
    'BBD': { decimals: 2 },
    'JMD': { decimals: 2 },
    'XCD': { decimals: 2 },
    'CUP': { decimals: 2 },
    
    // South American currencies
    'ARS': { decimals: 2 },
    'BRL': { decimals: 2 },
    'CLP': { decimals: 0 },
    'COP': { decimals: 2 },
    'PYG': { decimals: 0 },
    'PEN': { decimals: 2 },
    'UYU': { decimals: 2 },
    'VES': { decimals: 2 },
    
    // East Asian currencies
    'CNY': { decimals: 2, symbol: '¥' },
    'JPY': { decimals: 0, symbol: '¥' },
    'KRW': { decimals: 0 },
    'HKD': { decimals: 2 },
    'TWD': { decimals: 2 },
    
    // Southeast Asian currencies
    'IDR': { decimals: 0 },
    'MYR': { decimals: 2 },
    'PHP': { decimals: 2 },
    'SGD': { decimals: 2 },
    'THB': { decimals: 2 },
    'VND': { decimals: 0 },
    
    // South Asian currencies
    'INR': { decimals: 2 },
    'PKR': { decimals: 2 },
    'BDT': { decimals: 2 },
    'LKR': { decimals: 2 },
    'NPR': { decimals: 2 },
    
    // West Asian/Middle Eastern currencies
    'ILS': { decimals: 2 },
    'SAR': { decimals: 2 },
    'AED': { decimals: 2 },
    'TRY': { decimals: 2 },
    'IRR': { decimals: 2 },
    'JOD': { decimals: 3 },
    'KWD': { decimals: 3 },
    'OMR': { decimals: 3 },
    'QAR': { decimals: 2 },
    
    // North African currencies
    'EGP': { decimals: 2 },
    'DZD': { decimals: 2 },
    'MAD': { decimals: 2 },
    'TND': { decimals: 3 },
    
    // West African currencies
    'XOF': { decimals: 0 },
    'NGN': { decimals: 2 },
    'GHS': { decimals: 2 },
    
    // Central and East African currencies
    'XAF': { decimals: 0 },
    'ETB': { decimals: 2 },
    'KES': { decimals: 2 },
    'TZS': { decimals: 2 },
    'UGX': { decimals: 0 },
    
    // Southern African currencies
    'ZAR': { decimals: 2 },
    'BWP': { decimals: 2 },
    'ZMW': { decimals: 2 },
    'ZWL': { decimals: 2 },
    
    // Oceanian currencies
    'AUD': { decimals: 2 },
    'NZD': { decimals: 2 },
    'FJD': { decimals: 2 },
    'PGK': { decimals: 2 },
    
    'DEFAULT': { decimals: 2 }
};

function getCurrencyConfig(currency) {
    return CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.DEFAULT;
}

async function convertCurrency() {
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const convertButton = document.getElementById('convert-button');

    // Input validation
    if (isNaN(amount)) {
        document.getElementById('result').textContent = 'Please enter a valid number';
        document.getElementById('exchangeRate').textContent = '';
        return;
    }

    if (amount < 0) {
        amountInput.value = Math.abs(amount);
        return;
    }

    // Show loading state
    convertButton.disabled = true;
    document.getElementById('result').textContent = 'Converting...';
    document.getElementById('exchangeRate').textContent = '';

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        
        const rate = data.rates[toCurrency];
        const convertedAmount = amount * rate;

        // Get currency-specific configurations
        const fromConfig = getCurrencyConfig(fromCurrency);
        const toConfig = getCurrencyConfig(toCurrency);

        // Format the numbers using Intl.NumberFormat with currency-specific settings
        const fromFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: fromCurrency,
            minimumFractionDigits: fromConfig.decimals,
            maximumFractionDigits: fromConfig.decimals
        });

        const toFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: toCurrency,
            minimumFractionDigits: toConfig.decimals,
            maximumFractionDigits: toConfig.decimals
        });

        const rateFormatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        });

        // Format the results
        const formattedFromAmount = fromFormatter.format(amount);
        const formattedToAmount = toFormatter.format(convertedAmount);
        const formattedRate = rateFormatter.format(rate);

        // Update the display
        document.getElementById('result').textContent = 
            `${formattedFromAmount} = ${formattedToAmount}`;
        document.getElementById('exchangeRate').textContent = 
            `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`;
    } catch (error) {
        document.getElementById('result').textContent = 'Error during currency conversion. Please try again later.';
        document.getElementById('exchangeRate').textContent = '';
        console.error('Currency conversion error:', error);
    } finally {
        convertButton.disabled = false;
    }
}

function filterCurrencies(searchText, selectId) {
    const select = document.getElementById(selectId);
    const optgroups = Array.from(select.getElementsByTagName('optgroup'));
    searchText = searchText.toLowerCase();

    optgroups.forEach(optgroup => {
        const options = Array.from(optgroup.getElementsByTagName('option'));
        let hasVisibleOption = false;

        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            const value = option.value.toLowerCase();
            const isMatch = text.includes(searchText) || value.includes(searchText);
            
            if (isMatch) {
                hasVisibleOption = true;
                if (option.parentNode !== optgroup) {
                    optgroup.appendChild(option);
                }
            } else {
                option.remove();
            }
        });

        if (!hasVisibleOption) {
            optgroup.remove();
        }
    });
}

// Store original options for resetting
let originalFromOptions;
let originalToOptions;

document.addEventListener('DOMContentLoaded', () => {
    // Store original options
    originalFromOptions = document.getElementById('fromCurrency').cloneNode(true);
    originalToOptions = document.getElementById('toCurrency').cloneNode(true);

    // Add convert button click event listener
    document.getElementById('convert-button').addEventListener('click', convertCurrency);

    // Add search functionality with reset
    document.getElementById('fromSearch').addEventListener('input', (e) => {
        const select = document.getElementById('fromCurrency');
        if (e.target.value === '') {
            select.innerHTML = originalFromOptions.innerHTML;
        } else {
            select.innerHTML = originalFromOptions.innerHTML;
            filterCurrencies(e.target.value, 'fromCurrency');
        }
    });

    document.getElementById('toSearch').addEventListener('input', (e) => {
        const select = document.getElementById('toCurrency');
        if (e.target.value === '') {
            select.innerHTML = originalToOptions.innerHTML;
        } else {
            select.innerHTML = originalToOptions.innerHTML;
            filterCurrencies(e.target.value, 'toCurrency');
        }
    });
});
