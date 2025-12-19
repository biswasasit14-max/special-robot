// =====================================================
// LOCKDOWN SYSTEM
// =====================================================

const LockdownSystem = {
    isLockdownActive: false,
    lockdownStartTime: null,
    redirectTimeout: null,
    lockdownDuration: 300, // 5 minutes in seconds
    countdownInterval: null,
    
    init() {
        this.checkLockdownConditions();
        this.setupLockdownMonitor();
        this.updateConfigBanner();
    },
    
    checkLockdownConditions() {
        // Check if both server and services are in critical/down state
        const isCriticalState = (
            (SERVER_STATUS === 'DOWN' || SERVER_STATUS === 'CRITICAL') &&
            (SERVICE_HEALTH === 'DOWN' || SERVICE_HEALTH === 'CRITICAL')
        );
        
        if (isCriticalState && LOCKDOWN_ENABLED && !this.isLockdownActive) {
            this.activateLockdown();
        } else if (!isCriticalState && this.isLockdownActive) {
            this.deactivateLockdown();
        }
    },
    
    activateLockdown() {
        this.isLockdownActive = true;
        this.lockdownStartTime = Date.now();
        
        // Add lockdown class to body
        document.body.classList.add('lockdown-active');
        
        // Show lockdown spinner
        this.showLockdownSpinner();
        
        // Add lockdown effects to page
        this.addLockdownEffects();
        
        // Start countdown to redirect
        this.startRedirectCountdown();
        
        // Log lockdown event
        if (typeof LogsSystem !== 'undefined') {
            LogsSystem.addLog('critical', 'LOCKDOWN MODE ACTIVATED: Critical system failure detected');
        }
        
        console.log('🚨 LOCKDOWN MODE ACTIVATED');
    },
    
    deactivateLockdown() {
        this.isLockdownActive = false;
        
        // Remove lockdown effects
        document.body.classList.remove('lockdown-active');
        this.removeLockdownSpinner();
        this.clearRedirectCountdown();
        
        // Log lockdown deactivation
        if (typeof LogsSystem !== 'undefined') {
            LogsSystem.addLog('info', 'Lockdown mode deactivated: Systems restored');
        }
        
        console.log('✅ LOCKDOWN MODE DEACTIVATED');
    },
    
    showLockdownSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'lockdown-spinner';
        spinner.innerHTML = `
            <div class="lockdown-overlay">
                <div class="lockdown-content">
                    <div class="lockdown-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h2 class="lockdown-title">SYSTEM LOCKDOWN INITIATED</h2>
                    <div class="lockdown-message">
                        Critical system failure detected. Activating emergency protocols.
                    </div>
                    <div class="lockdown-countdown">
                        Redirecting to lockdown page in: <span id="redirect-timer">10</span> seconds
                    </div>
                    <div class="lockdown-progress">
                        <div class="progress-bar" id="lockdown-progress"></div>
                    </div>
                    <div class="lockdown-actions">
                        <button id="cancel-redirect-btn" class="lockdown-btn">
                            <i class="fas fa-times"></i> Cancel Redirect
                        </button>
                        <button id="proceed-now-btn" class="lockdown-btn primary">
                            <i class="fas fa-external-link-alt"></i> Proceed Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(spinner);
        
        // Add event listeners
        document.getElementById('cancel-redirect-btn').addEventListener('click', () => {
            this.cancelRedirect();
        });
        
        document.getElementById('proceed-now-btn').addEventListener('click', () => {
            this.redirectToLockdown();
        });
    },
    
    removeLockdownSpinner() {
        const spinner = document.getElementById('lockdown-spinner');
        if (spinner) {
            spinner.remove();
        }
    },
    
    addLockdownEffects() {
        // Add warning border to status indicators
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            indicator.classList.add('lockdown-pulse');
        });
        
        // Add warning to status cards
        const cards = document.querySelectorAll('.status-card');
        cards.forEach(card => {
            const warning = document.createElement('div');
            warning.className = 'lockdown-warning';
            warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> LOCKDOWN ACTIVE';
            card.appendChild(warning);
        });
        
        // Disable all interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select');
        interactiveElements.forEach(el => {
            el.setAttribute('data-original-pointer', el.style.pointerEvents || '');
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.5';
        });
    },
    
    removeLockdownEffects() {
        // Remove lockdown classes and styles
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            indicator.classList.remove('lockdown-pulse');
        });
        
        // Remove warning banners
        const warnings = document.querySelectorAll('.lockdown-warning');
        warnings.forEach(warning => warning.remove());
        
        // Restore interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select');
        interactiveElements.forEach(el => {
            const originalPointer = el.getAttribute('data-original-pointer');
            el.style.pointerEvents = originalPointer || '';
            el.style.opacity = '';
            el.removeAttribute('data-original-pointer');
        });
    },
    
    startRedirectCountdown() {
        let timeLeft = 10; // seconds
        const timerElement = document.getElementById('redirect-timer');
        const progressElement = document.getElementById('lockdown-progress');
        
        if (timerElement && progressElement) {
            this.countdownInterval = setInterval(() => {
                timeLeft--;
                timerElement.textContent = timeLeft;
                progressElement.style.width = `${((10 - timeLeft) / 10) * 100}%`;
                
                if (timeLeft <= 0) {
                    this.redirectToLockdown();
                }
            }, 1000);
        }
        
        // Set timeout for redirect
        this.redirectTimeout = setTimeout(() => {
            this.redirectToLockdown();
        }, 10000);
    },
    
    clearRedirectCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        if (this.redirectTimeout) {
            clearTimeout(this.redirectTimeout);
            this.redirectTimeout = null;
        }
    },
    
    cancelRedirect() {
        this.clearRedirectCountdown();
        this.removeLockdownSpinner();
        
        // Show cancellation message
        this.showNotification('Redirect cancelled. Monitoring system status...', 'warning');
        
        // Continue monitoring
        this.setupLockdownMonitor();
    },
    
    redirectToLockdown() {
        this.clearRedirectCountdown();
        window.location.href = 'lockdown.html';
    },
    
    setupLockdownMonitor() {
        // Monitor status changes every 5 seconds
        setInterval(() => {
            this.checkLockdownConditions();
        }, 5000);
    },
    
    updateConfigBanner() {
        const banner = document.querySelector('.config-banner');
        if (banner) {
            const lockdownItem = document.createElement('div');
            lockdownItem.className = 'config-item';
            lockdownItem.innerHTML = `
                <span class="config-name">LOCKDOWN_ENABLED:</span>
                <span class="config-value" id="config-lockdown">${LOCKDOWN_ENABLED}</span>
            `;
            banner.appendChild(lockdownItem);
        }
    },
    
    showNotification(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `lockdown-notification ${type}`;
        alert.textContent = message;
        
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? 'rgba(245, 158, 11, 0.9)' : 'rgba(26, 26, 46, 0.95)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10002;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            border-left: 4px solid ${type === 'warning' ? '#F59E0B' : '#3B82F6'};
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
};

// Initialize lockdown system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        LockdownSystem.init();
    }, 1500);
});

// Add CSS for lockdown effects
const lockdownStyles = document.createElement('style');
lockdownStyles.textContent = `
    /* Lockdown Spinner */
    .lockdown-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    }
    
    .lockdown-content {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .lockdown-icon {
        font-size: 4rem;
        color: #EF4444;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
    }
    
    .lockdown-title {
        color: #EF4444;
        font-size: 1.8rem;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .lockdown-message {
        color: #e6e6e6;
        margin-bottom: 30px;
        font-size: 1.1rem;
        opacity: 0.9;
    }
    
    .lockdown-countdown {
        color: #F59E0B;
        font-size: 1.2rem;
        margin-bottom: 20px;
        font-weight: 600;
    }
    
    .lockdown-progress {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        margin-bottom: 30px;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #EF4444, #F59E0B);
        width: 0%;
        transition: width 1s linear;
        border-radius: 4px;
    }
    
    .lockdown-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
    }
    
    .lockdown-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .lockdown-btn:not(.primary) {
        background: rgba(255, 255, 255, 0.1);
        color: #e6e6e6;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .lockdown-btn.primary {
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: white;
        font-weight: 600;
    }
    
    .lockdown-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    .lockdown-btn.primary:hover {
        background: linear-gradient(135deg, #DC2626, #B91C1C);
    }
    
    /* Lockdown effects on main page */
    .lockdown-pulse {
        animation: lockdownPulse 1s infinite;
    }
    
    .lockdown-warning {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    /* Animations */
    @keyframes lockdownPulse {
        0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.5); }
        50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.8); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    /* Body lockdown state */
    body.lockdown-active {
        position: relative;
    }
    
    body.lockdown-active::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 46, 0.3);
        z-index: 9999;
        pointer-events: none;
    }
`;
document.head.appendChild(lockdownStyles);