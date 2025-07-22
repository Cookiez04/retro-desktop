// Settings.app - Retro Control Panel JavaScript

class SettingsApp {
    constructor() {
        this.currentTheme = 'retro';
        this.currentWallpaper = 'gradient';
        this.settings = {
            theme: 'retro',
            wallpaper: 'gradient',
            crtEffects: true,
            particles: true,
            animations: true,
            bgOpacity: 1,
            masterVolume: 70,
            musicVolume: 70,
            masterMuted: false,
            musicMuted: false,
            musicEnabled: true,
            systemSounds: true,
            clickSounds: true,
            autoArrange: true,
            doubleClick: true,
            cursorTrail: true,
            hourFormat24: false
        };
        this.startTime = Date.now();
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupTabs();
        this.setupThemeControls();
        this.setupWallpaperControls();
        this.setupAudioControls();
        this.setupSystemControls();
        this.setupFooterButtons();
        this.updateSystemInfo();
        this.startSystemClock();
    }

    loadSettings() {
        // Load settings from localStorage
        const saved = localStorage.getItem('retro-desktop-settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to load settings:', e);
            }
        }
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('retro-desktop-settings', JSON.stringify(this.settings));
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.settings-tab');
        const panels = document.querySelectorAll('.settings-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = tab.getAttribute('data-tab');
                
                // Update tab states
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update panel states
                panels.forEach(p => p.classList.remove('active'));
                const panel = document.getElementById(`${targetPanel}-panel`);
                if (panel) {
                    panel.classList.add('active');
                }
            });
        });
    }

    setupThemeControls() {
        // Theme options
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                this.selectTheme(theme);
            });
        });

        // Visual effects checkboxes
        const crtEffects = document.getElementById('crt-effects');
        const particles = document.getElementById('particles');
        const animations = document.getElementById('animations');

        if (crtEffects) {
            crtEffects.checked = this.settings.crtEffects;
            crtEffects.addEventListener('change', (e) => {
                this.settings.crtEffects = e.target.checked;
                this.toggleCRTEffects(e.target.checked);
            });
        }

        if (particles) {
            particles.checked = this.settings.particles;
            particles.addEventListener('change', (e) => {
                this.settings.particles = e.target.checked;
                this.toggleParticles(e.target.checked);
            });
        }

        if (animations) {
            animations.checked = this.settings.animations;
            animations.addEventListener('change', (e) => {
                this.settings.animations = e.target.checked;
                this.toggleAnimations(e.target.checked);
            });
        }
    }

    setupWallpaperControls() {
        // Wallpaper options
        const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(option => {
            option.addEventListener('click', () => {
                const wallpaper = option.getAttribute('data-wallpaper');
                this.selectWallpaper(wallpaper);
            });
        });

        // Background opacity slider
        const bgOpacity = document.getElementById('bg-opacity');
        if (bgOpacity) {
            bgOpacity.value = this.settings.bgOpacity;
            this.updateSliderValue(bgOpacity, Math.round(this.settings.bgOpacity * 100) + '%');
            
            bgOpacity.addEventListener('input', (e) => {
                this.settings.bgOpacity = parseFloat(e.target.value);
                this.updateSliderValue(e.target, Math.round(this.settings.bgOpacity * 100) + '%');
                this.updateBackgroundOpacity();
            });
        }
    }

    setupAudioControls() {
        // Master volume
        const masterVolume = document.getElementById('master-volume');
        const masterMuteBtn = document.getElementById('master-mute-btn');
        
        if (masterVolume) {
            masterVolume.value = this.settings.masterVolume;
            this.updateSliderValue(masterVolume, this.settings.masterVolume + '%');
            
            masterVolume.addEventListener('input', (e) => {
                this.settings.masterVolume = parseInt(e.target.value);
                this.updateSliderValue(e.target, this.settings.masterVolume + '%');
                this.updateMasterVolume();
            });
        }

        if (masterMuteBtn) {
            this.updateMuteButton(masterMuteBtn, this.settings.masterMuted);
            masterMuteBtn.addEventListener('click', () => {
                this.settings.masterMuted = !this.settings.masterMuted;
                this.updateMuteButton(masterMuteBtn, this.settings.masterMuted);
                this.updateMasterVolume();
            });
        }

        // Music volume
        const musicVolume = document.getElementById('music-volume');
        const musicMuteBtn = document.getElementById('music-mute-btn');
        const musicEnabled = document.getElementById('music-enabled');
        
        if (musicVolume) {
            musicVolume.value = this.settings.musicVolume;
            this.updateSliderValue(musicVolume, this.settings.musicVolume + '%');
            
            musicVolume.addEventListener('input', (e) => {
                this.settings.musicVolume = parseInt(e.target.value);
                this.updateSliderValue(e.target, this.settings.musicVolume + '%');
                this.updateMusicVolume();
            });
        }

        if (musicMuteBtn) {
            this.updateMuteButton(musicMuteBtn, this.settings.musicMuted);
            musicMuteBtn.addEventListener('click', () => {
                this.settings.musicMuted = !this.settings.musicMuted;
                this.updateMuteButton(musicMuteBtn, this.settings.musicMuted);
                this.updateMusicVolume();
            });
        }

        if (musicEnabled) {
            musicEnabled.checked = this.settings.musicEnabled;
            musicEnabled.addEventListener('change', (e) => {
                this.settings.musicEnabled = e.target.checked;
                this.toggleMusicPlayer(e.target.checked);
            });
        }

        // System sounds
        const systemSounds = document.getElementById('system-sounds');
        const clickSounds = document.getElementById('click-sounds');

        if (systemSounds) {
            systemSounds.checked = this.settings.systemSounds;
            systemSounds.addEventListener('change', (e) => {
                this.settings.systemSounds = e.target.checked;
            });
        }

        if (clickSounds) {
            clickSounds.checked = this.settings.clickSounds;
            clickSounds.addEventListener('change', (e) => {
                this.settings.clickSounds = e.target.checked;
            });
        }
    }

    setupSystemControls() {
        // Desktop behavior
        const autoArrange = document.getElementById('auto-arrange');
        const doubleClick = document.getElementById('double-click');
        const cursorTrail = document.getElementById('cursor-trail');
        const hourFormat24 = document.getElementById('24-hour-format');
        const resetBtn = document.getElementById('reset-settings-btn');

        if (autoArrange) {
            autoArrange.checked = this.settings.autoArrange;
            autoArrange.addEventListener('change', (e) => {
                this.settings.autoArrange = e.target.checked;
            });
        }

        if (doubleClick) {
            doubleClick.checked = this.settings.doubleClick;
            doubleClick.addEventListener('change', (e) => {
                this.settings.doubleClick = e.target.checked;
            });
        }

        if (cursorTrail) {
            cursorTrail.checked = this.settings.cursorTrail;
            cursorTrail.addEventListener('change', (e) => {
                this.settings.cursorTrail = e.target.checked;
                this.toggleCursorTrail(e.target.checked);
            });
        }

        if (hourFormat24) {
            hourFormat24.checked = this.settings.hourFormat24;
            hourFormat24.addEventListener('change', (e) => {
                this.settings.hourFormat24 = e.target.checked;
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    }

    setupFooterButtons() {
        const applyBtn = document.getElementById('apply-settings');
        const cancelBtn = document.getElementById('cancel-settings');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applySettings();
                this.saveSettings();
                this.showNotification('Settings applied successfully!');
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.loadSettings();
                this.showNotification('Settings cancelled.');
            });
        }
    }

    selectTheme(theme) {
        // Update UI
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        this.settings.theme = theme;
        this.applyTheme(theme);
    }

    selectWallpaper(wallpaper) {
        // Update UI
        document.querySelectorAll('.wallpaper-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-wallpaper="${wallpaper}"]`).classList.add('active');
        
        this.settings.wallpaper = wallpaper;
        this.applyWallpaper(wallpaper);
    }

    applySettings() {
        this.applyTheme(this.settings.theme);
        this.applyWallpaper(this.settings.wallpaper);
        this.toggleCRTEffects(this.settings.crtEffects);
        this.toggleParticles(this.settings.particles);
        this.toggleAnimations(this.settings.animations);
        this.updateBackgroundOpacity();
        this.updateMasterVolume();
        this.updateMusicVolume();
        this.toggleMusicPlayer(this.settings.musicEnabled);
        this.toggleCursorTrail(this.settings.cursorTrail);
    }

    applyTheme(theme) {
        const body = document.body;
        body.className = body.className.replace(/theme-\w+/g, '');
        body.classList.add(`theme-${theme}`);
        
        // Update CSS custom properties based on theme
        const root = document.documentElement;
        switch (theme) {
            case 'dark':
                root.style.setProperty('--primary-navy', '#1a1a1a');
                root.style.setProperty('--steel-grey', '#333333');
                root.style.setProperty('--vaporwave-pink', '#ff6ec7');
                root.style.setProperty('--cyber-blue', '#00ffff');
                break;
            case 'light':
                root.style.setProperty('--primary-navy', '#f0f0f0');
                root.style.setProperty('--steel-grey', '#ffffff');
                root.style.setProperty('--vaporwave-pink', '#ff6ec7');
                root.style.setProperty('--cyber-blue', '#0080ff');
                break;
            case 'cyberpunk':
                root.style.setProperty('--primary-navy', '#000000');
                root.style.setProperty('--steel-grey', '#1a1a1a');
                root.style.setProperty('--vaporwave-pink', '#ff00ff');
                root.style.setProperty('--cyber-blue', '#39ff14');
                break;
            default: // retro
                root.style.setProperty('--primary-navy', '#000080');
                root.style.setProperty('--steel-grey', '#c0c0c0');
                root.style.setProperty('--vaporwave-pink', '#ff6ec7');
                root.style.setProperty('--cyber-blue', '#00ffff');
                break;
        }
    }

    applyWallpaper(wallpaper) {
        const body = document.body;
        body.className = body.className.replace(/wallpaper-\w+/g, '');
        body.classList.add(`wallpaper-${wallpaper}`);
    }

    toggleCRTEffects(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.add('crt-enabled');
        } else {
            body.classList.remove('crt-enabled');
        }
    }

    toggleParticles(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.add('particles-enabled');
        } else {
            body.classList.remove('particles-enabled');
        }
    }

    toggleAnimations(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.add('animations-enabled');
        } else {
            body.classList.remove('animations-enabled');
        }
    }

    toggleCursorTrail(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.add('cursor-trail-enabled');
        } else {
            body.classList.remove('cursor-trail-enabled');
        }
    }

    updateBackgroundOpacity() {
        const desktop = document.querySelector('.desktop');
        if (desktop) {
            desktop.style.opacity = this.settings.bgOpacity;
        }
    }

    updateMasterVolume() {
        // Apply to all audio elements
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (!this.settings.masterMuted) {
                audio.volume = (this.settings.masterVolume / 100) * (audio.dataset.originalVolume || 1);
            } else {
                audio.volume = 0;
            }
        });
    }

    updateMusicVolume() {
        // Apply specifically to music player
        if (window.mixtapePlayer && window.mixtapePlayer.audio) {
            const volume = this.settings.musicMuted ? 0 : this.settings.musicVolume / 100;
            window.mixtapePlayer.setVolume(volume);
            window.mixtapePlayer.globalMute(this.settings.musicMuted);
        }
    }

    toggleMusicPlayer(enabled) {
        if (window.mixtapePlayer) {
            if (!enabled) {
                window.mixtapePlayer.pause();
            }
        }
    }

    updateMuteButton(button, muted) {
        const icon = button.querySelector('i');
        if (muted) {
            button.classList.add('muted');
            if (icon) {
                icon.className = icon.className.replace(/fa-volume-\w+/, 'fa-volume-mute');
            }
        } else {
            button.classList.remove('muted');
            if (icon) {
                icon.className = icon.className.replace(/fa-volume-\w+/, 'fa-volume-up');
            }
        }
    }

    updateSliderValue(slider, value) {
        const valueSpan = slider.parentElement.querySelector('.slider-value');
        if (valueSpan) {
            valueSpan.textContent = value;
        }
    }

    updateSystemInfo() {
        // Browser info
        const browserInfo = document.getElementById('browser-info');
        if (browserInfo) {
            browserInfo.textContent = navigator.userAgent.split(' ')[0] || 'Unknown';
        }

        // Resolution info
        const resolutionInfo = document.getElementById('resolution-info');
        if (resolutionInfo) {
            resolutionInfo.textContent = `${window.screen.width}x${window.screen.height}`;
        }
    }

    startSystemClock() {
        const updateClock = () => {
            const now = new Date();
            const timeDisplay = document.getElementById('current-time-display');
            const dateDisplay = document.getElementById('current-date-display');
            const uptimeDisplay = document.getElementById('uptime-info');

            if (timeDisplay) {
                const timeOptions = {
                    hour12: !this.settings.hourFormat24,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                timeDisplay.textContent = now.toLocaleTimeString('en-US', timeOptions);
            }

            if (dateDisplay) {
                dateDisplay.textContent = now.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            if (uptimeDisplay) {
                const uptime = Date.now() - this.startTime;
                const hours = Math.floor(uptime / (1000 * 60 * 60));
                const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
                uptimeDisplay.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            // Reset to defaults
            this.settings = {
                theme: 'retro',
                wallpaper: 'gradient',
                crtEffects: true,
                particles: true,
                animations: true,
                bgOpacity: 1,
                masterVolume: 70,
                musicVolume: 70,
                masterMuted: false,
                musicMuted: false,
                musicEnabled: true,
                systemSounds: true,
                clickSounds: true,
                autoArrange: true,
                doubleClick: true,
                cursorTrail: true,
                hourFormat24: false
            };
            
            this.applySettings();
            this.updateUI();
            this.saveSettings();
            this.showNotification('Settings reset to defaults.');
        }
    }

    updateUI() {
        // Update all UI elements to reflect current settings
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-theme') === this.settings.theme);
        });
        
        document.querySelectorAll('.wallpaper-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-wallpaper') === this.settings.wallpaper);
        });
        
        // Update checkboxes and sliders
        const elements = {
            'crt-effects': this.settings.crtEffects,
            'particles': this.settings.particles,
            'animations': this.settings.animations,
            'music-enabled': this.settings.musicEnabled,
            'system-sounds': this.settings.systemSounds,
            'click-sounds': this.settings.clickSounds,
            'auto-arrange': this.settings.autoArrange,
            'double-click': this.settings.doubleClick,
            'cursor-trail': this.settings.cursorTrail,
            '24-hour-format': this.settings.hourFormat24
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && element.type === 'checkbox') {
                element.checked = value;
            }
        });
        
        // Update sliders
        const sliders = {
            'bg-opacity': { value: this.settings.bgOpacity, display: Math.round(this.settings.bgOpacity * 100) + '%' },
            'master-volume': { value: this.settings.masterVolume, display: this.settings.masterVolume + '%' },
            'music-volume': { value: this.settings.musicVolume, display: this.settings.musicVolume + '%' }
        };
        
        Object.entries(sliders).forEach(([id, config]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = config.value;
                this.updateSliderValue(element, config.display);
            }
        });
    }

    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = 'settings-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, #ccffcc, #99ff99);
            color: #006600;
            padding: 10px 20px;
            border: 2px outset #99ff99;
            border-radius: 4px;
            font-family: 'VT323', monospace;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize Settings App when window opens
function initSettingsApp() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.settingsApp = new SettingsApp();
        });
    } else {
        window.settingsApp = new SettingsApp();
    }
}

// Auto-initialize if settings window is already in DOM
if (document.getElementById('settings-window')) {
    initSettingsApp();
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);