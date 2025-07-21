// Retro Desktop JavaScript

class RetroDesktop {
    constructor() {
        this.openWindows = new Map();
        this.activeWindow = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.startMenuOpen = false;
        this.paintCanvas = null;
        this.paintContext = null;
        this.isDrawing = false;
        
        this.init();
    }

    init() {
        this.setupBootScreen();
        this.setupDesktopIcons();
        this.setupStartMenu();
        this.setupTaskbar();
        this.setupWindows();
        this.setupPaintApp();
        this.setupClock();
        this.setupKeyboardShortcuts();
        this.initCursorTrail();
    }

    setupBootScreen() {
        const bootScreen = document.getElementById('boot-screen');
        
        // Simulate boot process
        setTimeout(() => {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                this.playBootSound();
            }, 1000);
        }, 3000);
    }

    setupDesktopIcons() {
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        
        desktopIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const windowType = icon.getAttribute('data-window');
                this.openWindow(windowType);
            });

            // Double click support
            let clickCount = 0;
            let clickTimer = null;
            
            icon.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 300);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    const windowType = icon.getAttribute('data-window');
                    this.openWindow(windowType);
                }
            });
        });
    }

    setupStartMenu() {
        const startButton = document.getElementById('start-button');
        const startMenu = document.getElementById('start-menu');
        const startMenuItems = document.querySelectorAll('.start-menu-item');
        const shutdownBtn = document.getElementById('shutdown-btn');

        // Toggle start menu
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Close start menu when clicking outside
        document.addEventListener('click', () => {
            if (this.startMenuOpen) {
                this.closeStartMenu();
            }
        });

        // Start menu items
        startMenuItems.forEach(item => {
            if (item !== shutdownBtn) {
                item.addEventListener('click', () => {
                    const windowType = item.getAttribute('data-window');
                    this.openWindow(windowType);
                    this.closeStartMenu();
                });
            }
        });

        // Shutdown button
        shutdownBtn.addEventListener('click', () => {
            this.showShutdownDialog();
        });
    }

    setupTaskbar() {
        const taskbarWindows = document.getElementById('taskbar-windows');
        
        // Taskbar will be populated by openWindow method
    }

    setupWindows() {
        const windows = document.querySelectorAll('.window');
        
        windows.forEach(window => {
            this.setupWindowControls(window);
            this.setupWindowDragging(window);
        });
    }

    setupWindowControls(window) {
        const minimizeBtn = window.querySelector('.minimize-btn');
        const maximizeBtn = window.querySelector('.maximize-btn');
        const closeBtn = window.querySelector('.close-btn');

        minimizeBtn.addEventListener('click', () => {
            this.minimizeWindow(window);
        });

        maximizeBtn.addEventListener('click', () => {
            this.maximizeWindow(window);
        });

        closeBtn.addEventListener('click', () => {
            this.closeWindow(window);
        });
    }

    setupWindowDragging(window) {
        const header = window.querySelector('.window-header');
        
        header.addEventListener('mousedown', (e) => {
            this.startDragging(window, e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.dragWindow(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });
    }

    setupPaintApp() {
        const paintCanvas = document.getElementById('paint-canvas');
        if (!paintCanvas) return;

        this.paintCanvas = paintCanvas;
        this.paintContext = paintCanvas.getContext('2d');
        
        // Set up canvas
        this.paintContext.fillStyle = 'white';
        this.paintContext.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
        
        // Paint tools
        const paintTools = document.querySelectorAll('.paint-tool');
        const colorPicker = document.getElementById('paint-color');
        
        paintTools.forEach(tool => {
            tool.addEventListener('click', () => {
                paintTools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
            });
        });

        // Drawing functionality
        paintCanvas.addEventListener('mousedown', (e) => {
            this.startDrawing(e);
        });

        paintCanvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                this.draw(e);
            }
        });

        paintCanvas.addEventListener('mouseup', () => {
            this.stopDrawing();
        });

        paintCanvas.addEventListener('mouseleave', () => {
            this.stopDrawing();
        });
    }

    setupClock() {
        this.updateClock();
        setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + Tab to cycle through windows
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.cycleWindows();
            }
            
            // Escape to close start menu
            if (e.key === 'Escape') {
                this.closeStartMenu();
            }
        });
    }

    // Window Management
    openWindow(windowType) {
        const windowId = `${windowType}-window`;
        const window = document.getElementById(windowId);
        
        if (!window) return;

        // Check if window is already open
        if (this.openWindows.has(windowType)) {
            this.focusWindow(windowType);
            return;
        }

        // Position window
        const offset = this.openWindows.size * 30;
        window.style.left = `${100 + offset}px`;
        window.style.top = `${100 + offset}px`;
        window.style.display = 'block';
        window.style.zIndex = this.getNextZIndex();

        // Add to open windows
        this.openWindows.set(windowType, {
            element: window,
            type: windowType,
            minimized: false
        });

        this.focusWindow(windowType);
        this.updateTaskbar();
        this.playWindowOpenSound();
    }

    focusWindow(windowType) {
        const windowData = this.openWindows.get(windowType);
        if (!windowData) return;

        // Bring to front
        windowData.element.style.zIndex = this.getNextZIndex();
        this.activeWindow = windowType;

        // Update taskbar
        this.updateTaskbarActive();
    }

    minimizeWindow(window) {
        const windowType = this.getWindowType(window);
        const windowData = this.openWindows.get(windowType);
        
        if (windowData) {
            windowData.minimized = true;
            window.style.display = 'none';
            this.updateTaskbar();
        }
    }

    maximizeWindow(window) {
        const currentWidth = window.offsetWidth;
        const currentHeight = window.offsetHeight;
        
        if (currentWidth < window.innerWidth * 0.8) {
            // Maximize
            window.style.width = '80%';
            window.style.height = '70%';
            window.style.left = '10%';
            window.style.top = '10%';
        } else {
            // Restore
            window.style.width = '400px';
            window.style.height = '300px';
            window.style.left = '100px';
            window.style.top = '100px';
        }
    }

    closeWindow(window) {
        const windowType = this.getWindowType(window);
        this.openWindows.delete(windowType);
        window.style.display = 'none';
        this.updateTaskbar();
        this.playWindowCloseSound();
    }

    getWindowType(window) {
        const windowId = window.id;
        return windowId.replace('-window', '');
    }

    // Dragging
    startDragging(window, e) {
        this.isDragging = true;
        this.activeWindow = this.getWindowType(window);
        
        const rect = window.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        
        window.style.zIndex = this.getNextZIndex();
    }

    dragWindow(e) {
        if (!this.isDragging) return;
        
        const window = document.getElementById(`${this.activeWindow}-window`);
        if (!window) return;

        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        window.style.left = `${x}px`;
        window.style.top = `${y}px`;
    }

    stopDragging() {
        this.isDragging = false;
    }

    // Start Menu
    toggleStartMenu() {
        if (this.startMenuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }

    openStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.add('active');
        this.startMenuOpen = true;
    }

    closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.remove('active');
        this.startMenuOpen = false;
    }

    // Taskbar
    updateTaskbar() {
        const taskbarWindows = document.getElementById('taskbar-windows');
        taskbarWindows.innerHTML = '';

        this.openWindows.forEach((windowData, windowType) => {
            if (!windowData.minimized) {
                const taskbarItem = this.createTaskbarItem(windowType);
                taskbarWindows.appendChild(taskbarItem);
            }
        });
    }

    createTaskbarItem(windowType) {
        const item = document.createElement('div');
        item.className = 'taskbar-window';
        item.innerHTML = `
            <i class="fas fa-${this.getWindowIcon(windowType)}"></i>
            <span>${this.getWindowTitle(windowType)}</span>
        `;
        
        item.addEventListener('click', () => {
            this.focusWindow(windowType);
        });

        return item;
    }

    updateTaskbarActive() {
        const taskbarItems = document.querySelectorAll('.taskbar-window');
        taskbarItems.forEach(item => {
            item.classList.remove('active');
        });

        if (this.activeWindow) {
            const activeItem = Array.from(taskbarItems).find(item => 
                item.querySelector('span').textContent === this.getWindowTitle(this.activeWindow)
            );
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }
    }

    getWindowIcon(windowType) {
        const icons = {
            projects: 'folder',
            about: 'user',
            resume: 'file-pdf',
            recycle: 'trash',
            paint: 'paint-brush',
            notepad: 'sticky-note'
        };
        return icons[windowType] || 'window-maximize';
    }

    getWindowTitle(windowType) {
        const titles = {
            projects: 'My Projects',
            about: 'About Me',
            resume: 'Resume.pdf',
            recycle: 'Recycle Bin',
            paint: 'Paint',
            notepad: 'Notepad'
        };
        return titles[windowType] || windowType;
    }

    // Paint App
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.paintCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.paintContext.beginPath();
        this.paintContext.moveTo(x, y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.paintCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const color = document.getElementById('paint-color').value;
        this.paintContext.strokeStyle = color;
        this.paintContext.lineWidth = 2;
        this.paintContext.lineCap = 'round';
        
        this.paintContext.lineTo(x, y);
        this.paintContext.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    // Clock
    updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
        }
    }

    // Utility Methods
    getNextZIndex() {
        const windows = document.querySelectorAll('.window');
        let maxZ = 10;
        windows.forEach(window => {
            const z = parseInt(window.style.zIndex) || 10;
            if (z > maxZ) maxZ = z;
        });
        return maxZ + 1;
    }

    cycleWindows() {
        const windowTypes = Array.from(this.openWindows.keys());
        if (windowTypes.length === 0) return;
        
        const currentIndex = windowTypes.indexOf(this.activeWindow);
        const nextIndex = (currentIndex + 1) % windowTypes.length;
        this.focusWindow(windowTypes[nextIndex]);
    }

    showShutdownDialog() {
        const confirmed = confirm('Are you sure you want to shut down Retro Desktop?');
        if (confirmed) {
            this.shutdown();
        }
    }

    initCursorTrail() {
        const trail = [];
        const trailLength = 10;
        
        // Create trail elements
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${6 - i * 0.5}px;
                height: ${6 - i * 0.5}px;
                background: radial-gradient(circle, rgba(0, 255, 255, ${1 - i * 0.1}) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                transition: all 0.1s ease;
                opacity: ${1 - i * 0.1};
            `;
            document.body.appendChild(dot);
            trail.push({ element: dot, x: 0, y: 0 });
        }
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            // Update trail positions
            for (let i = trail.length - 1; i > 0; i--) {
                trail[i].x = trail[i - 1].x;
                trail[i].y = trail[i - 1].y;
            }
            
            trail[0].x = e.clientX;
            trail[0].y = e.clientY;
            
            // Apply positions to elements
            trail.forEach((dot, index) => {
                dot.element.style.left = dot.x - 3 + 'px';
                dot.element.style.top = dot.y - 3 + 'px';
            });
        });
    }

    shutdown() {
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.style.display = 'flex';
        bootScreen.style.opacity = '1';
        
        setTimeout(() => {
            alert('Thank you for using Retro Desktop!');
            window.close();
        }, 2000);
    }

    // Sound Effects (simulated)
    playBootSound() {
        // Simulate boot sound
        console.log('🎵 Boot sound played');
    }

    playWindowOpenSound() {
        // Simulate window open sound
        console.log('🔊 Window open sound');
    }

    playWindowCloseSound() {
        // Simulate window close sound
        console.log('🔊 Window close sound');
    }
}

// Initialize the desktop when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.retroDesktop = new RetroDesktop();
});

// Prevent context menu on desktop
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Easter egg: BSOD
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        this.showBSOD();
    }
});

function showBSOD() {
    const bsod = document.createElement('div');
    bsod.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000080;
        color: white;
        font-family: 'Courier New', monospace;
        padding: 50px;
        z-index: 100000;
        font-size: 14px;
        line-height: 1.5;
    `;
    
    bsod.innerHTML = `
        <h1 style="color: #ffffff;">A problem has been detected and Retro Desktop has been shut down to prevent damage to your nostalgia.</h1>
        <br>
        <p>If this is the first time you've seen this error screen, restart your browser. If this screen appears again, follow these steps:</p>
        <br>
        <p>Check for any retro gaming viruses on your system. Remove any newly installed retro games and restart your browser.</p>
        <br>
        <p>Technical information:</p>
        <br>
        <p>*** STOP: 0x0000007B (0xF78D2524, 0xC0000034, 0x00000000, 0x00000000)</p>
        <br>
        <p>Press any key to continue...</p>
    `;
    
    document.body.appendChild(bsod);
    
    document.addEventListener('keydown', () => {
        document.body.removeChild(bsod);
    }, { once: true });
}