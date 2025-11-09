/**
 * Custom Alert Function
 * Displays a themed alert popup matching the neobrutalism pastel theme
 *
 * @param {string} message - The message to display in the alert
 * @param {string} type - Alert type: 'success', 'error', 'warning', 'info' (default: 'info')
 */
function showAlert(message, type = 'info') {
    // Get alert elements
    const alertOverlay = document.getElementById('customAlertOverlay');
    const alertMessage = document.getElementById('customAlertMessage');
    const alertContainer = document.getElementById('customAlertContainer');
    const alertIcon = document.getElementById('customAlertIcon');
    const alertTitle = document.getElementById('customAlertTitle');

    if (!alertOverlay || !alertMessage || !alertContainer) {
        console.error('Custom alert elements not found. Make sure the HTML is included in your page.');
        // Fallback to browser alert
        alert(message);
        return;
    }

    // Set message
    alertMessage.textContent = message;

    // Remove previous type classes
    alertContainer.className = 'custom-alert-container';
    alertIcon.className = 'custom-alert-icon';

    // Set type (success, error, warning, info)
    const validTypes = ['success', 'error', 'warning', 'info'];
    const alertType = validTypes.includes(type) ? type : 'info';

    alertContainer.classList.add(alertType);
    alertIcon.classList.add(alertType);

    // Set icon based on type
    let iconClass = 'fa-circle-info';
    let titleText = 'Alert';

    switch(alertType) {
        case 'success':
            iconClass = 'fa-circle-check';
            titleText = 'Success';
            break;
        case 'error':
            iconClass = 'fa-circle-xmark';
            titleText = 'Error';
            break;
        case 'warning':
            iconClass = 'fa-triangle-exclamation';
            titleText = 'Warning';
            break;
        case 'info':
        default:
            iconClass = 'fa-circle-info';
            titleText = 'Information';
            break;
    }

    alertIcon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    alertTitle.textContent = titleText;

    // Show alert
    alertOverlay.classList.add('active');

    // Focus the OK button for accessibility
    const okButton = document.getElementById('customAlertOk');
    if (okButton) {
        setTimeout(() => {
            okButton.focus();
        }, 100);
    }
}

/**
 * Close the custom alert
 */
function closeCustomAlert() {
    const alertOverlay = document.getElementById('customAlertOverlay');
    if (alertOverlay) {
        alertOverlay.classList.remove('active');
    }
}

// Close alert when clicking OK button
document.addEventListener('DOMContentLoaded', () => {
    const okButton = document.getElementById('customAlertOk');
    if (okButton) {
        okButton.addEventListener('click', closeCustomAlert);
    }

    // Close alert when clicking outside (on overlay)
    const alertOverlay = document.getElementById('customAlertOverlay');
    if (alertOverlay) {
        alertOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'customAlertOverlay') {
                closeCustomAlert();
            }
        });
    }

    // Close alert when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const alertOverlay = document.getElementById('customAlertOverlay');
            if (alertOverlay && alertOverlay.classList.contains('active')) {
                closeCustomAlert();
            }
        }
    });
});

// Example usage functions (for convenience)
function showSuccessAlert(message) {
    showAlert(message, 'success');
}

function showErrorAlert(message) {
    showAlert(message, 'error');
}

function showWarningAlert(message) {
    showAlert(message, 'warning');
}

function showInfoAlert(message) {
    showAlert(message, 'info');
}

