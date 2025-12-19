// =====================================================
// LOGS MANAGEMENT SYSTEM
// =====================================================

const LogsSystem = {
    logs: [],
    isPaused: false,
    currentFilter: 'all',
    autoRefreshInterval: null,
    maxLogs: 100,
    
    init() {
        this.loadSampleLogs();
        this.setupEventListeners();
        this.startAutoRefresh();
        this.renderLogs();
    },
    
    loadSampleLogs() {
        const sampleLogs = [
            { time: '10:25:43', level: 'info', message: 'System initialized successfully' },
            { time: '10:25:45', level: 'debug', message: 'Loading configuration from localStorage' },
            { time: '10:26:12', level: 'warning', message: 'Cache service running at 85% capacity' },
            { time: '10:27:01', level: 'info', message: 'Database connection established' },
            { time: '10:28:30', level: 'error', message: 'API endpoint /api/status returned 503' },
            { time: '10:29:15', level: 'info', message: 'Auto-refresh interval set to 30 seconds' },
            { time: '10:30:00', level: 'debug', message: 'Memory usage: 65% (2.3GB/3.5GB)' },
            { time: '10:31:22', level: 'warning', message: 'Disk I/O latency above threshold' },
            { time: '10:32:45', level: 'info', message: 'Backup scheduled for 02:00 UTC' },
            { time: '10:33:10', level: 'debug', message: 'User session created: ID-7842' }
        ];
        
        this.logs = sampleLogs.map(log => ({
            ...log,
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString()
        }));
    },
    
    addLog(level, message) {
        if (this.isPaused) return;
        
        const logEntry = {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            level,
            message,
            timestamp: new Date().toISOString()
        };
        
        this.logs.unshift(logEntry);
        
        // Keep only last N logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
        
        this.renderLogs();
        
        // Show notification if enabled
        if (level === 'error' || level === 'critical') {
            this.showNotification(level, message);
        }
    },
    
    renderLogs() {
        const container = document.getElementById('logs-list');
        if (!container) return;
        
        const filteredLogs = this.currentFilter === 'all' 
            ? this.logs 
            : this.logs.filter(log => log.level === this.currentFilter);
        
        container.innerHTML = filteredLogs.map(log => `
            <div class="log-entry ${log.level}" data-id="${log.id}">
                <div class="log-time">${log.time}</div>
                <div class="log-level"><span class="log-badge ${log.level}">${log.level.toUpperCase()}</span></div>
                <div class="log-message">${log.message}</div>
            </div>
        `).join('');
    },
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderLogs();
            });
        });
        
        // Clear logs button
        const clearBtn = document.getElementById('clear-logs-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all logs?')) {
                    this.logs = [];
                    this.renderLogs();
                    this.addLog('info', 'Logs cleared by user');
                }
            });
        }
        
        // Search logs
        const searchInput = document.getElementById('log-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const logEntries = document.querySelectorAll('.log-entry');
                
                logEntries.forEach(entry => {
                    const message = entry.querySelector('.log-message').textContent.toLowerCase();
                    entry.style.display = message.includes(searchTerm) ? 'grid' : 'none';
                });
            });
        }
        
        // Export logs
        const exportBtn = document.getElementById('export-logs-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportLogs());
        }
        
        // Pause logs
        const pauseBtn = document.getElementById('pause-logs-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause(pauseBtn));
        }
        
        // Refresh interval select
        const refreshSelect = document.getElementById('refresh-interval');
        if (refreshSelect) {
            refreshSelect.addEventListener('change', (e) => {
                this.setRefreshInterval(parseInt(e.target.value));
            });
        }
        
        // View logs button - FIXED: Opens modal instead of alert
        const viewLogsBtn = document.getElementById('logs-btn');
        if (viewLogsBtn) {
            // Replace button to remove old event listeners
            const newBtn = viewLogsBtn.cloneNode(true);
            viewLogsBtn.parentNode.replaceChild(newBtn, viewLogsBtn);
            
            // Add new event listener
            document.getElementById('logs-btn').addEventListener('click', (e) => {
                e.preventDefault();
                this.openLogsModal();
            });
        }
    },
    
    togglePause(button) {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            button.innerHTML = '<i class="fas fa-play"></i> Resume';
            this.addLog('info', 'Log streaming paused');
        } else {
            button.innerHTML = '<i class="fas fa-pause"></i> Pause';
            this.addLog('info', 'Log streaming resumed');
        }
    },
    
    setRefreshInterval(seconds) {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        if (seconds > 0) {
            this.autoRefreshInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.generateRandomLog();
                }
            }, seconds * 1000);
            
            this.addLog('info', `Auto-refresh interval set to ${seconds} seconds`);
        }
    },
    
    startAutoRefresh() {
        this.setRefreshInterval(30); // Default 30 seconds
    },
    
    generateRandomLog() {
        const levels = ['info', 'debug', 'warning', 'error'];
        const messages = [
            'CPU usage: ' + (20 + Math.random() * 50).toFixed(1) + '%',
            'Memory available: ' + (1 + Math.random() * 3).toFixed(1) + 'GB',
            'Network latency: ' + (10 + Math.random() * 90).toFixed(0) + 'ms',
            'Database queries: ' + Math.floor(Math.random() * 1000) + '/sec',
            'Active users: ' + Math.floor(500 + Math.random() * 1500),
            'API response time: ' + (50 + Math.random() * 200).toFixed(0) + 'ms',
            'Disk I/O: ' + (30 + Math.random() * 70).toFixed(1) + 'MB/s',
            'Cache hit rate: ' + (70 + Math.random() * 25).toFixed(1) + '%'
        ];
        
        const level = levels[Math.floor(Math.random() * levels.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.addLog(level, message);
    },
    
    exportLogs() {
        const logText = this.logs.map(log => 
            `[${log.time}] ${log.level.toUpperCase()}: ${log.message}`
        ).join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `logs-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLog('info', 'Logs exported successfully');
    },
    
    openLogsModal() {
        const modal = document.createElement('div');
        modal.className = 'logs-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-file-alt"></i> System Logs</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="logs-list" style="max-height: none;">
                        ${this.logs.map(log => `
                            <div class="log-entry ${log.level}">
                                <div class="log-time">${log.time}</div>
                                <div class="log-level"><span class="log-badge ${log.level}">${log.level.toUpperCase()}</span></div>
                                <div class="log-message">${log.message}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        this.addLog('info', 'Logs viewer opened');
    },
    
    showNotification(level, message) {
        if (!document.getElementById('notifications-toggle')?.checked) return;
        
        if (Notification.permission === 'granted') {
            new Notification(`System ${level.toUpperCase()}`, {
                body: message,
                icon: '/favicon.ico'
            });
        }
    }
};

// Initialize logs system when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Initialize logs system
    LogsSystem.init();
});

// Export for use in other scripts
window.LogsSystem = LogsSystem;