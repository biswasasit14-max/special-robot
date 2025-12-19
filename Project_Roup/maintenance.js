// =====================================================
// MAINTENANCE MODE SYSTEM
// =====================================================

// Maintenance configuration
const MAINTENANCE_CONFIG = {
    enabled: false,           // Master switch
    accessCode: "ADMIN123",   // Change this code
    redirectPage: "maintenance.html",
    bypassKey: "maintenance-bypass"
};

// Initialize maintenance mode
function initializeMaintenanceMode() {
    const maintenanceBtn = document.getElementById('maintenance-btn');
    if (!maintenanceBtn) return;
    
    // Update button text based on current state
    maintenanceBtn.innerHTML = MAINTENANCE_CONFIG.enabled ? 
        '<i class="fas fa-tools"></i> Exit Maintenance' : 
        '<i class="fas fa-tools"></i> Enter Maintenance';
    
    // Add click handler
    maintenanceBtn.addEventListener('click', handleMaintenanceButton);
    
    // Check if we're already in maintenance mode
    checkMaintenanceStatus();
}

// Handle maintenance button click
function handleMaintenanceButton(e) {
    e.preventDefault();
    
    if (MAINTENANCE_CONFIG.enabled) {
        // Exit maintenance mode
        showExitMaintenancePrompt();
    } else {
        // Enter maintenance mode
        showMaintenancePrompt();
    }
}

// Show maintenance access prompt
function showMaintenancePrompt() {
    const modal = createModal(
        'Enter Maintenance Mode',
        'Enter access code to enable maintenance mode:',
        'password'
    );
    
    modal.onSubmit = (code) => {
        if (code === MAINTENANCE_CONFIG.accessCode) {
            enableMaintenanceMode();
            modal.close();
            showMaintenanceActivated();
        } else {
            modal.showError('Invalid access code');
        }
    };
    
    modal.open();
}

// Show exit maintenance prompt
function showExitMaintenancePrompt() {
    const modal = createModal(
        'Exit Maintenance Mode',
        'Enter access code to disable maintenance mode:',
        'password'
    );
    
    modal.onSubmit = (code) => {
        if (code === MAINTENANCE_CONFIG.accessCode) {
            disableMaintenanceMode();
            modal.close();
            showMaintenanceDeactivated();
        } else {
            modal.showError('Invalid access code');
        }
    };
    
    modal.open();
}

// Enable maintenance mode
function enableMaintenanceMode() {
    MAINTENANCE_CONFIG.enabled = true;
    
    // Update button
    const maintenanceBtn = document.getElementById('maintenance-btn');
    if (maintenanceBtn) {
        maintenanceBtn.innerHTML = '<i class="fas fa-tools"></i> Exit Maintenance';
        maintenanceBtn.classList.add('btn-warning');
        maintenanceBtn.classList.remove('btn-danger');
    }
    
    // Set maintenance flag in localStorage
    localStorage.setItem('maintenance-mode', 'true');
    localStorage.setItem('maintenance-time', new Date().toISOString());
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = MAINTENANCE_CONFIG.redirectPage;
    }, 2000);
}

// Disable maintenance mode
function disableMaintenanceMode() {
    MAINTENANCE_CONFIG.enabled = false;
    
    // Update button
    const maintenanceBtn = document.getElementById('maintenance-btn');
    if (maintenanceBtn) {
        maintenanceBtn.innerHTML = '<i class="fas fa-tools"></i> Enter Maintenance';
        maintenanceBtn.classList.remove('btn-warning');
        maintenanceBtn.classList.add('btn-danger');
    }
    
    // Clear maintenance flag
    localStorage.removeItem('maintenance-mode');
    localStorage.removeItem('maintenance-time');
    localStorage.removeItem(MAINTENANCE_CONFIG.bypassKey);
}

// Check maintenance status
function checkMaintenanceStatus() {
    const maintenanceActive = localStorage.getItem('maintenance-mode') === 'true';
    
    // If maintenance is active but we're not on maintenance page, redirect
    if (maintenanceActive && 
        !window.location.pathname.includes(MAINTENANCE_CONFIG.redirectPage) &&
        !localStorage.getItem(MAINTENANCE_CONFIG.bypassKey)) {
        
        // Show warning before redirect
        showRedirectWarning();
        
        setTimeout(() => {
            window.location.href = MAINTENANCE_CONFIG.redirectPage;
        }, 3000);
    }
}

// Show maintenance activated message
function showMaintenanceActivated() {
    const alert = createAlert(
        'Maintenance mode activated! Redirecting to maintenance page...',
        'warning',
        3000
    );
    
    // Update page content to show maintenance state
    document.querySelectorAll('.status-indicator').forEach(indicator => {
        indicator.style.opacity = '0.7';
    });
    
    document.querySelectorAll('.btn:not(#maintenance-btn)').forEach(btn => {
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
    });
}

// Show maintenance deactivated message
function showMaintenanceDeactivated() {
    createAlert(
        'Maintenance mode disabled. System returning to normal operation.',
        'success',
        3000
    );
    
    // Restore page content
    document.querySelectorAll('.status-indicator').forEach(indicator => {
        indicator.style.opacity = '1';
    });
    
    document.querySelectorAll('.btn:not(#maintenance-btn)').forEach(btn => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    });
}

// Show redirect warning
function showRedirectWarning() {
    const alert = createAlert(
        'System is in maintenance mode. Redirecting to maintenance page...',
        'warning',
        2500
    );
}

// =====================================================
// MODAL CREATION UTILITY
// =====================================================
function createModal(title, message, inputType = 'text') {
    const modal = document.createElement('div');
    modal.className = 'maintenance-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(26, 26, 46, 0.95);
        border-radius: 15px;
        padding: 30px;
        width: 90%;
        max-width: 400px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
        color: #4cc9f0;
        margin-bottom: 15px;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    titleEl.innerHTML = `<i class="fas fa-tools"></i> ${title}`;
    
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        color: #e6e6e6;
        margin-bottom: 25px;
        opacity: 0.9;
    `;
    
    const input = document.createElement('input');
    input.type = inputType;
    input.placeholder = 'Enter access code...';
    input.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
        font-size: 1rem;
        margin-bottom: 20px;
        outline: none;
        transition: border-color 0.3s;
    `;
    input.addEventListener('focus', () => {
        input.style.borderColor = '#4cc9f0';
    });
    input.addEventListener('blur', () => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: flex-end;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #e6e6e6;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s;
    `;
    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        border: none;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s;
    `;
    
    const errorEl = document.createElement('div');
    errorEl.style.cssText = `
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 10px;
        min-height: 20px;
        display: none;
    `;
    
    // Event handlers
    cancelBtn.addEventListener('click', () => modal.close());
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
    });
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    submitBtn.addEventListener('click', () => {
        if (modal.onSubmit) {
            modal.onSubmit(input.value.trim());
        }
    });
    submitBtn.addEventListener('mouseenter', () => {
        submitBtn.style.background = 'linear-gradient(135deg, #3a56d4, #2d0b8c)';
        submitBtn.style.transform = 'translateY(-2px)';
    });
    submitBtn.addEventListener('mouseleave', () => {
        submitBtn.style.background = 'linear-gradient(135deg, #4361ee, #3a0ca3)';
        submitBtn.style.transform = 'translateY(0)';
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
    
    // Assemble modal
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(submitBtn);
    
    modalContent.appendChild(titleEl);
    modalContent.appendChild(messageEl);
    modalContent.appendChild(input);
    modalContent.appendChild(buttonContainer);
    modalContent.appendChild(errorEl);
    modal.appendChild(modalContent);
    
    // Modal methods
    modal.open = () => {
        document.body.appendChild(modal);
        input.focus();
    };
    
    modal.close = () => {
        document.body.removeChild(modal);
    };
    
    modal.showError = (message) => {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        input.style.borderColor = '#ef4444';
        
        // Shake animation
        input.style.animation = 'shake 0.5s';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    };
    
    return modal;
}

// =====================================================
// ALERT CREATION UTILITY
// =====================================================
function createAlert(message, type = 'info', duration = 3000) {
    const alert = document.createElement('div');
    alert.className = 'maintenance-alert';
    
    const colors = {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
    };
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(26, 26, 46, 0.95);
        border-left: 4px solid ${colors[type] || colors.info};
        border-radius: 8px;
        padding: 15px 20px;
        color: #e6e6e6;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(150%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;
    
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}" 
               style="color: ${colors[type] || colors.info}; font-size: 1.2rem;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 5px;">${type.toUpperCase()}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove
    setTimeout(() => {
        alert.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (alert.parentNode) {
                document.body.removeChild(alert);
            }
        }, 300);
    }, duration);
    
    return alert;
}

// =====================================================
// SHAKE ANIMATION (for error states)
// =====================================================
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// =====================================================
// INITIALIZE ON PAGE LOAD
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeMaintenanceMode();
    }, 100);
});