// =====================================================
// EXPANDED STATUS CONFIGURATION
// =====================================================
const expandedStatusConfig = {
    UP: {
        color: 'status-up',
        icon: '<i class="fas fa-check"></i>',
        description: 'All systems operational and running smoothly.',
        linkState: 'normal',
        redirect: false,
        uptime: '99.9%',
        response: '48ms',
        load: '32%',
        users: '1.2k',
        latency: '25ms',
        history: ['up', 'up', 'up', 'up']
    },
    PAR: {
        color: 'status-partial',
        icon: '<div class="spinner"><i class="fas fa-sync-alt"></i></div>',
        description: 'Partial maintenance ongoing. Some features may be limited.',
        linkState: 'dim',
        redirect: false,
        uptime: '95.2%',
        response: '120ms',
        load: '68%',
        users: '850',
        latency: '85ms',
        history: ['up', 'warning', 'warning', 'up']
    },
    DOWN: {
        color: 'status-down',
        icon: '<i class="fas fa-times"></i>',
        description: 'System undergoing maintenance. Please try again later.',
        linkState: 'disabled',
        redirect: true,
        uptime: '0%',
        response: 'Timeout',
        load: '100%',
        users: '0',
        latency: '>500ms',
        history: ['up', 'up', 'critical', 'critical']
    },
    WARNING: {
        color: 'status-warning',
        icon: '<i class="fas fa-exclamation-triangle"></i>',
        description: 'Performance degradation detected. Investigating issues.',
        linkState: 'dim',
        redirect: false,
        uptime: '97.5%',
        response: '200ms',
        load: '85%',
        users: '950',
        latency: '150ms',
        history: ['up', 'warning', 'warning', 'warning'],
        animation: 'blink'
    },
    CRITICAL: {
        color: 'status-critical',
        icon: '<i class="fas fa-skull-crossbones"></i>',
        description: 'Critical system failure. Immediate attention required.',
        linkState: 'disabled',
        redirect: true,
        uptime: '45.3%',
        response: '500ms',
        load: '95%',
        users: '320',
        latency: '>1000ms',
        history: ['up', 'degraded', 'critical', 'critical'],
        animation: 'pulse'
    },
    DEGRADED: {
        color: 'status-degraded',
        icon: '<i class="fas fa-tachometer-alt"></i>',
        description: 'System performance degraded. Running at reduced capacity.',
        linkState: 'normal',
        redirect: false,
        uptime: '88.7%',
        response: '300ms',
        load: '72%',
        users: '1.1k',
        latency: '200ms',
        history: ['up', 'up', 'degraded', 'degraded']
    },
    INFO: {
        color: 'status-info',
        icon: '<i class="fas fa-info-circle"></i>',
        description: 'System in info mode. Routine checks in progress.',
        linkState: 'normal',
        redirect: false,
        uptime: '99.5%',
        response: '75ms',
        load: '45%',
        users: '1.5k',
        latency: '50ms',
        history: ['up', 'info', 'up', 'info']
    }
};

// =====================================================
// EXPANDED SERVICE HEALTH CONFIGURATION
// =====================================================
const expandedServiceHealthConfig = {
    UP: {
        color: 'status-up',
        icon: '<i class="fas fa-heart"></i>',
        description: 'All core services are running optimally.',
        services: ['green', 'green', 'green', 'green'],
        latency: '25ms',
        errors: '0.01%',
        throughput: '1.2M req/s'
    },
    PAR: {
        color: 'status-partial',
        icon: '<i class="fas fa-heartbeat"></i>',
        description: 'Some services experiencing intermittent issues.',
        services: ['green', 'yellow', 'green', 'yellow'],
        latency: '85ms',
        errors: '0.5%',
        throughput: '850k req/s'
    },
    DOWN: {
        color: 'status-down',
        icon: '<i class="fas fa-heart-broken"></i>',
        description: 'Critical services are down. Investigating.',
        services: ['red', 'red', 'yellow', 'red'],
        latency: '>500ms',
        errors: '15.2%',
        throughput: '120k req/s'
    },
    WARNING: {
        color: 'status-warning',
        icon: '<i class="fas fa-heartbeat"></i>',
        description: 'Service performance below optimal levels.',
        services: ['yellow', 'yellow', 'green', 'yellow'],
        latency: '150ms',
        errors: '2.3%',
        throughput: '950k req/s'
    },
    CRITICAL: {
        color: 'status-critical',
        icon: '<i class="fas fa-heart-crack"></i>',
        description: 'Multiple service failures affecting core functionality.',
        services: ['red', 'red', 'red', 'yellow'],
        latency: '>1000ms',
        errors: '45.7%',
        throughput: '50k req/s'
    },
    DEGRADED: {
        color: 'status-degraded',
        icon: '<i class="fas fa-heartbeat"></i>',
        description: 'Services running with reduced performance.',
        services: ['yellow', 'green', 'yellow', 'green'],
        latency: '120ms',
        errors: '1.2%',
        throughput: '780k req/s'
    },
    INFO: {
        color: 'status-info',
        icon: '<i class="fas fa-heart"></i>',
        description: 'Services operational with informational notices.',
        services: ['green', 'green', 'blue', 'green'],
        latency: '35ms',
        errors: '0.1%',
        throughput: '1.1M req/s'
    }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================
function updateStatusHistory(historyArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    historyArray.forEach(status => {
        const dotClass = 
            status === 'up' ? 'up' :
            status === 'warning' ? 'warning' :
            status === 'critical' ? 'critical' :
            status === 'degraded' ? 'degraded' :
            status === 'info' ? 'info' : 'up';
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-dot ${dotClass}"></div>
            <span>${status.charAt(0).toUpperCase() + status.slice(1)} status</span>
        `;
        container.appendChild(item);
    });
}

function updateExtraMetrics(config, prefix) {
    const elements = {
        load: document.getElementById(`${prefix}-load-value`),
        users: document.getElementById(`${prefix}-users-value`),
        latency: document.getElementById(`${prefix}-latency-value`),
        errors: document.getElementById(`${prefix}-errors-value`),
        throughput: document.getElementById(`${prefix}-throughput-value`)
    };
    
    if (elements.load && config.load) elements.load.textContent = config.load;
    if (elements.users && config.users) elements.users.textContent = config.users;
    if (elements.latency && config.latency) elements.latency.textContent = config.latency;
    if (elements.errors && config.errors) elements.errors.textContent = config.errors;
    if (elements.throughput && config.throughput) elements.throughput.textContent = config.throughput;
}

function updateServiceIndicators(servicesConfig) {
    const serviceIndicators = document.querySelectorAll('.service-status');
    servicesConfig.forEach((color, index) => {
        if (index < serviceIndicators.length) {
            serviceIndicators[index].style.color = 
                color === 'green' ? '#10B981' : 
                color === 'yellow' ? '#F59E0B' : 
                color === 'red' ? '#EF4444' :
                color === 'blue' ? '#3B82F6' : '#10B981';
        }
    });
}

// =====================================================
// MAIN CONFIGURATION APPLICATION
// =====================================================
function applyEnhancedConfiguration() {
    // Wait for config variables to be available
    if (typeof SERVER_STATUS === 'undefined' || typeof SERVICE_HEALTH === 'undefined') {
        setTimeout(applyEnhancedConfiguration, 100);
        return;
    }
    
    const serverConfig = expandedStatusConfig[SERVER_STATUS] || expandedStatusConfig.UP;
    const healthConfig = expandedServiceHealthConfig[SERVICE_HEALTH] || expandedServiceHealthConfig.UP;
    
    // Apply server status
    const serverIndicator = document.getElementById('server-status-indicator');
    if (serverIndicator) {
        serverIndicator.className = `status-indicator ${serverConfig.color}`;
        if (serverConfig.animation) {
            serverIndicator.classList.add(serverConfig.animation);
        }
        serverIndicator.innerHTML = serverConfig.icon;
    }
    
    // Apply service health
    const healthIndicator = document.getElementById('service-health-indicator');
    if (healthIndicator) {
        healthIndicator.className = `status-indicator ${healthConfig.color}`;
        healthIndicator.innerHTML = healthConfig.icon;
    }
    
    // Update descriptions
    const serverDesc = document.getElementById('server-status-description');
    const serviceDesc = document.getElementById('service-health-description');
    if (serverDesc) serverDesc.textContent = serverConfig.description;
    if (serviceDesc) serviceDesc.textContent = healthConfig.description;
    
    // Update metrics
    const uptimeValue = document.getElementById('server-uptime-value');
    const responseValue = document.getElementById('server-response-value');
    if (uptimeValue) uptimeValue.textContent = serverConfig.uptime;
    if (responseValue) responseValue.textContent = serverConfig.response;
    
    // Update extra metrics
    updateExtraMetrics(serverConfig, 'server');
    updateExtraMetrics(healthConfig, 'service');
    
    // Update service indicators
    updateServiceIndicators(healthConfig.services);
    
    // Update history
    if (serverConfig.history) {
        updateStatusHistory(serverConfig.history, 'server-history');
    }
    
    // Update navigation based on server status
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('dim', 'disabled');
        if (serverConfig.linkState === 'dim') {
            link.classList.add('dim');
        } else if (serverConfig.linkState === 'disabled') {
            link.classList.add('disabled');
            if (!link.href.includes('#') && link.id !== 'home-link') {
                link.removeAttribute('href');
            }
        }
    });
    
    // Update configuration display
    const configServerStatus = document.getElementById('config-server-status');
    const configServiceHealth = document.getElementById('config-service-health');
    const configShowRepo = document.getElementById('config-show-repo');
    
    if (configServerStatus) configServerStatus.textContent = `"${SERVER_STATUS}"`;
    if (configServiceHealth) configServiceHealth.textContent = `"${SERVICE_HEALTH}"`;
    if (configShowRepo) configShowRepo.textContent = SHOW_REPOSITORY;
    
    // Update repository link
    const repoLink = document.getElementById('repo-link');
    if (repoLink) {
        if (!SHOW_REPOSITORY) {
            repoLink.classList.add('disabled');
            repoLink.style.display = 'none';
        } else {
            repoLink.classList.remove('disabled');
            repoLink.style.display = 'inline-flex';
        }
    }
    
    // Update current year
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Redirect guard for downtime
    if (serverConfig.redirect && window.location.pathname !== '/') {
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }
}

// =====================================================
// EVENT HANDLERS
// =====================================================
function setupEventHandlers() {
    // Home link reset
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            if (SERVER_STATUS === 'DOWN' || SERVER_STATUS === 'CRITICAL') {
                e.preventDefault();
                location.reload();
            }
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            location.reload();
        });
    }
    
    // Logs button - REMOVED ALERT, LogsSystem handles this
    const logsBtn = document.getElementById('logs-btn');
    if (logsBtn) {
        // Remove any existing event listener
        const newLogsBtn = logsBtn.cloneNode(true);
        logsBtn.parentNode.replaceChild(newLogsBtn, logsBtn);
    }
    
    // Metrics button
    const metricsBtn = document.getElementById('metrics-btn');
    if (metricsBtn) {
        metricsBtn.addEventListener('click', () => {
            alert('Detailed metrics dashboard would load here.');
        });
    }
    
    // Maintenance button - maintenance.js handles this
    
    // Status indicator hover effects
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', () => {
            indicator.style.transform = 'scale(1.1)';
        });
        indicator.addEventListener('mouseleave', () => {
            indicator.style.transform = 'scale(1)';
        });
    });
}

// =====================================================
// INITIALIZATION
// =====================================================
function initializeDashboard() {
    // Apply configuration
    applyEnhancedConfiguration();
    
    // Setup event handlers
    setupEventHandlers();
    
    // Initialize other systems with delay to ensure config is loaded
    setTimeout(() => {
        // Initialize logs system if available
        if (typeof LogsSystem !== 'undefined' && typeof LogsSystem.init === 'function') {
            LogsSystem.init();
        }
        
        // Initialize lockdown system if available
        if (typeof LockdownSystem !== 'undefined' && typeof LockdownSystem.init === 'function') {
            LockdownSystem.init();
        }
        
        // Initialize config editor if available
        if (typeof ConfigEditor !== 'undefined' && typeof ConfigEditor.init === 'function') {
            ConfigEditor.init();
        }
    }, 500);
}

// =====================================================
// START INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Export functions for use in other scripts
window.applyEnhancedConfiguration = applyEnhancedConfiguration;
window.initializeDashboard = initializeDashboard;