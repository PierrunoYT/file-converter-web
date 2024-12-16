document.addEventListener('DOMContentLoaded', () => {
    const inputTime = document.getElementById('inputTime');
    const sourceTimezone = document.getElementById('sourceTimezone');
    const targetTimezone = document.getElementById('targetTimezone');
    const convertBtn = document.getElementById('convertBtn');
    const outputDisplay = document.getElementById('outputDisplay');
    const errorMessage = document.getElementById('errorMessage');
    const copyBtn = document.getElementById('copyBtn');

    // Get all supported timezones using Intl API
    const timezones = Intl.supportedValuesOf('timeZone');

    // Filter and format timezones to show only continent/country
    function formatTimezones(timezones) {
        return timezones
            .filter(tz => tz.includes('/')) // Only keep timezones with continent/city format
            .map(tz => {
                const [continent, ...rest] = tz.split('/');
                const location = rest.join('/').replace(/_/g, ' ');
                return {
                    value: tz,
                    label: `${continent}/${location}`
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    // Populate timezone dropdown
    function populateTimezoneDropdown(dropdownElement, timezones) {
        dropdownElement.innerHTML = '';
        timezones.forEach(tz => {
            const option = document.createElement('div');
            option.className = 'timezone-option';
            option.textContent = tz.label;
            option.dataset.value = tz.value;
            dropdownElement.appendChild(option);
        });
    }

    // Setup timezone search and dropdown functionality
    function setupTimezoneInput(inputElement, dropdownElement, onSelect) {
        const dropdown = document.getElementById(dropdownElement);
        const input = document.getElementById(inputElement);
        
        // Populate initial dropdown
        populateTimezoneDropdown(dropdown, formattedTimezones);

        // Show dropdown on focus
        input.addEventListener('focus', () => {
            dropdown.style.display = 'block';
        });

        // Filter timezones on input
        input.addEventListener('input', () => {
            const searchText = input.value.toLowerCase();
            const filteredTimezones = formattedTimezones.filter(tz => 
                tz.label.toLowerCase().includes(searchText) || 
                tz.value.toLowerCase().includes(searchText)
            );
            populateTimezoneDropdown(dropdown, filteredTimezones);
            dropdown.style.display = 'block';
        });

        // Handle timezone selection
        dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.timezone-option');
            if (option) {
                const value = option.dataset.value;
                const label = option.textContent;
                input.value = label;
                input.dataset.value = value;
                dropdown.style.display = 'none';
                if (onSelect) onSelect(value);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Convert time between timezones using Intl.DateTimeFormat
    function convertTime(date, fromTimezone, toTimezone) {
        try {
            if (!date || !fromTimezone || !toTimezone) {
                throw new Error('Missing required parameters');
            }

            if (!(date instanceof Date) || isNaN(date.getTime())) {
                throw new Error('Invalid date format');
            }

            // Validate timezones
            try {
                Intl.DateTimeFormat('en-US', { timeZone: fromTimezone });
                Intl.DateTimeFormat('en-US', { timeZone: toTimezone });
            } catch (e) {
                throw new Error('Invalid timezone specified');
            }

            // Create formatters for both timezones
            const options = {
                timeZone: fromTimezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZoneName: 'long'
            };

            const sourceFormatter = new Intl.DateTimeFormat('en-US', options);
            options.timeZone = toTimezone;
            const targetFormatter = new Intl.DateTimeFormat('en-US', options);

            return {
                sourceTime: sourceFormatter.format(date),
                targetTime: targetFormatter.format(date)
            };
        } catch (error) {
            throw new Error('Error converting time: ' + error.message);
        }
    }

    // Calculate time difference between timezones
    function getTimezoneDifference(date, sourceZone, targetZone) {
        try {
            if (!date || !sourceZone || !targetZone) {
                throw new Error('Missing required parameters');
            }

            if (!(date instanceof Date) || isNaN(date.getTime())) {
                throw new Error('Invalid date format');
            }

            // Validate timezones
            try {
                Intl.DateTimeFormat('en-US', { timeZone: sourceZone });
                Intl.DateTimeFormat('en-US', { timeZone: targetZone });
            } catch (e) {
                throw new Error('Invalid timezone specified');
            }

            // Get the UTC timestamps for both timezones
            const sourceUTC = date.getTime() - date.getTimezoneOffset() * 60000;
            const sourceTime = new Date(sourceUTC).toLocaleString('en-US', { timeZone: sourceZone });
            const targetTime = new Date(sourceUTC).toLocaleString('en-US', { timeZone: targetZone });

            // Calculate the difference
            const sourceDateObj = new Date(sourceTime);
            const targetDateObj = new Date(targetTime);
            const diffMinutes = (targetDateObj - sourceDateObj) / (1000 * 60);
            
            // Handle edge cases around DST transitions
            const hours = Math.floor(Math.abs(diffMinutes) / 60);
            const minutes = Math.round(Math.abs(diffMinutes) % 60);
            const sign = diffMinutes >= 0 ? '+' : '-';
            
            return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            throw new Error('Error calculating time difference: ' + error.message);
        }
    }

    // Format and populate timezone dropdowns
    const formattedTimezones = formatTimezones(timezones);
    setupTimezoneInput('sourceTimezone', 'sourceTimezoneDropdown');
    setupTimezoneInput('targetTimezone', 'targetTimezoneDropdown');

    // Set default timezone (user's local timezone)
    try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (userTimezone && timezones.includes(userTimezone)) {
            const userTzFormatted = formattedTimezones.find(tz => tz.value === userTimezone);
            if (userTzFormatted) {
                sourceTimezone.value = userTzFormatted.label;
                sourceTimezone.dataset.value = userTzFormatted.value;
            }
        }
    } catch (error) {
        console.error('Error setting default timezone:', error);
    }

    // Set current time as default
    const now = new Date();
    inputTime.value = now.toISOString().slice(0, 19);

    // Handle conversion
    convertBtn.addEventListener('click', () => {
        try {
            errorMessage.style.display = 'none';
            const sourceZone = sourceTimezone.dataset.value;
            const targetZone = targetTimezone.dataset.value;
            
            if (!sourceZone || !targetZone) {
                throw new Error('Please select both source and target timezones');
            }

            const inputDateTime = new Date(inputTime.value);
            if (isNaN(inputDateTime.getTime())) {
                throw new Error('Please enter a valid date and time');
            }

            const { sourceTime, targetTime } = convertTime(inputDateTime, sourceZone, targetZone);
            const timeDiff = getTimezoneDifference(inputDateTime, sourceZone, targetZone);

            outputDisplay.innerHTML = `
                <div class="time">${sourceTime}</div>
                <div style="color: var(--primary-color); margin: 0.5rem 0;">
                    <i class="fas fa-arrow-right"></i>
                    <span style="margin-left: 0.5rem">Time Difference: ${timeDiff}</span>
                </div>
                <div class="time">${targetTime}</div>
                <button class="copy-btn" id="copyBtn" title="Copy to clipboard">
                    <i class="fas fa-copy"></i>
                </button>
            `;
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });

    // Copy result to clipboard
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            const textToCopy = outputDisplay.textContent.trim();
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text:', err);
                });
        }
    });
});
