// Retro Vinyl Player - Complete Redesign JavaScript

class VinylPlayer {
    constructor() {
        console.log('VinylPlayer constructor called');
        this.audio = null;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.volume = 0.7;
        this.isMuted = false;
        this.isLooping = false;
        this.isDragging = false;
        this.volumeKnobRotation = 252; // Start at 70% volume (252 degrees)
        
        this.tracks = [
            {
                title: "Edge Engine Warmup",
                artist: "Preview Track",
                file: "public/tracks/edge-engine-warmup-preview.mp3"
            },
            {
                title: "Loopstate Lullaby",
                artist: "Preview Track",
                file: "public/tracks/loopstate-lullaby-preview.mp3"
            }
        ];
        
        this.init();
    }

    init() {
        this.setupAudioElement();
        this.setupControls();
        this.setupProgressBar();
        this.setupVolumeControl();
        this.setupTrackGrid();
        this.setupSpeedSelector();
        this.loadTrack(0);
        this.updateDisplay();
        this.updatePowerLight();
    }

    setupAudioElement() {
        this.audio = document.getElementById('audio-player');
        if (!this.audio) {
            console.error('Audio element not found');
            return;
        }

        // Audio event listeners
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('ended', () => {
            this.handleTrackEnd();
        });

        this.audio.addEventListener('error', (e) => {
            console.warn('Audio loading error:', e);
            this.nextTrack();
        });

        // Set initial volume
        this.audio.volume = this.volume;
    }

    setupControls() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        const playIcon = document.getElementById('play-icon');
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Previous button
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousTrack();
            });
        }

        // Next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextTrack();
            });
        }

        // Loop button
        const loopBtn = document.getElementById('loop-btn');
        if (loopBtn) {
            loopBtn.addEventListener('click', () => {
                this.toggleLoop();
            });
        }
    }

    setupProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progressNeedle = document.getElementById('progress-needle');
        
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    this.seekToPosition(e);
                }
            });
        }

        if (progressNeedle) {
            let isDragging = false;
            
            progressNeedle.addEventListener('mousedown', (e) => {
                isDragging = true;
                this.isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.seekToPosition(e);
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    setTimeout(() => {
                        this.isDragging = false;
                    }, 100);
                }
            });
        }
    }

    setupVolumeControl() {
        const volumeBtn = document.getElementById('volume-btn');
        const volumeKnob = document.getElementById('volume-knob');
        const volumeIcon = document.getElementById('volume-icon');

        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }

        if (volumeKnob) {
            let isDragging = false;
            let startAngle = 0;
            let startRotation = this.volumeKnobRotation;

            const getAngle = (e, element) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                return (angle * 180 / Math.PI + 360) % 360;
            };

            volumeKnob.addEventListener('mousedown', (e) => {
                isDragging = true;
                startAngle = getAngle(e, volumeKnob);
                startRotation = this.volumeKnobRotation;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const currentAngle = getAngle(e, volumeKnob);
                    let deltaAngle = currentAngle - startAngle;
                    
                    // Handle angle wrap-around
                    if (deltaAngle > 180) deltaAngle -= 360;
                    if (deltaAngle < -180) deltaAngle += 360;
                    
                    let newRotation = startRotation + deltaAngle;
                    
                    // Constrain rotation to valid range (180° to 360°, representing 0% to 100%)
                    newRotation = Math.max(180, Math.min(360, newRotation));
                    
                    this.volumeKnobRotation = newRotation;
                    this.updateVolumeFromKnob();
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        // Set initial knob position
        this.updateVolumeKnobVisual();
    }

    setupSpeedSelector() {
        const speedBtns = document.querySelectorAll('.speed-btn');
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                speedBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Update vinyl rotation speed
                const speed = btn.dataset.speed;
                this.updateVinylSpeed(speed);
            });
        });
    }

    setupTrackGrid() {
        console.log('setupTrackGrid called');
        const trackGrid = document.getElementById('track-grid');
        if (!trackGrid) {
            console.error('track-grid element not found!');
            return;
        }

        trackGrid.innerHTML = '';
        
        this.tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = `track-item ${index === this.currentTrackIndex ? 'playing' : ''}`;
            trackItem.innerHTML = `
                <div class="track-vinyl-icon" id="track-vinyl-${index}">
                </div>
                <div class="track-details">
                    <div class="track-name">${track.title}</div>
                    <div class="track-artist-name">${track.artist}</div>
                </div>
            `;
            
            trackItem.addEventListener('click', () => {
                this.loadTrack(index);
                this.play();
            });
            
            trackGrid.appendChild(trackItem);
        });
    }

    updateVolumeFromKnob() {
        // Convert rotation (180° to 360°) to volume (0 to 1)
        const normalizedRotation = (this.volumeKnobRotation - 180) / 180;
        this.volume = Math.max(0, Math.min(1, normalizedRotation));
        
        if (this.audio) {
            this.audio.volume = this.isMuted ? 0 : this.volume;
        }
        
        this.updateVolumeKnobVisual();
        this.updateVolumeIcon();
    }

    updateVolumeKnobVisual() {
        const knobIndicator = document.querySelector('.knob-indicator');
        if (knobIndicator) {
            knobIndicator.style.transform = `translateX(-50%) rotate(${this.volumeKnobRotation}deg)`;
        }
    }

    updateVinylSpeed(speed) {
        const vinylRecord = document.getElementById('vinyl-record');
        if (vinylRecord && this.isPlaying) {
            // Remove existing animation
            vinylRecord.style.animation = 'none';
            // Force reflow
            vinylRecord.offsetHeight;
            // Apply new animation with different speed
            const duration = speed === '45' ? '1.33s' : '1.8s'; // 45 RPM is faster
            vinylRecord.style.animation = `vinylSpin ${duration} linear infinite`;
        }
    }

    updatePowerLight() {
        const powerLight = document.getElementById('power-light');
        if (powerLight) {
            if (this.isPlaying) {
                powerLight.classList.add('on');
            } else {
                powerLight.classList.remove('on');
            }
        }
    }

    updateTonearm() {
        const tonearm = document.getElementById('tonearm');
        if (tonearm) {
            if (this.isPlaying) {
                tonearm.classList.add('playing');
            } else {
                tonearm.classList.remove('playing');
            }
        }
    }

    updateVinylAnimation() {
        const vinylRecord = document.getElementById('vinyl-record');
        if (vinylRecord) {
            if (this.isPlaying) {
                vinylRecord.classList.add('spinning');
                // Apply current speed
                const activeSpeedBtn = document.querySelector('.speed-btn.active');
                if (activeSpeedBtn) {
                    this.updateVinylSpeed(activeSpeedBtn.dataset.speed);
                }
            } else {
                vinylRecord.classList.remove('spinning');
                vinylRecord.style.animation = 'none';
            }
        }
    }

    updateTrackVinyls() {
        this.tracks.forEach((track, index) => {
            const trackVinyl = document.getElementById(`track-vinyl-${index}`);
            if (trackVinyl) {
                if (index === this.currentTrackIndex && this.isPlaying) {
                    trackVinyl.classList.add('spinning');
                } else {
                    trackVinyl.classList.remove('spinning');
                }
            }
        });
    }

    loadTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        if (this.audio) {
            this.audio.src = track.file;
            this.audio.load();
        }
        
        this.updateDisplay();
        this.updateTrackSelection();
    }

    updateDisplay() {
        const track = this.tracks[this.currentTrackIndex];
        
        // Update vinyl label
        const vinylTrackTitle = document.getElementById('vinyl-track-title');
        const vinylTrackArtist = document.getElementById('vinyl-track-artist');
        
        if (vinylTrackTitle) {
            vinylTrackTitle.textContent = track.title;
        }
        if (vinylTrackArtist) {
            vinylTrackArtist.textContent = track.artist;
        }
    }

    updateTrackSelection() {
        // Update track grid items
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, index) => {
            if (index === this.currentTrackIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
        
        this.updateTrackVinyls();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.audio) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton();
                    this.updateVinylAnimation();
                    this.updateTonearm();
                    this.updatePowerLight();
                    this.updateTrackVinyls();
                }).catch(error => {
                    console.warn('Play failed:', error);
                });
            }
        }
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.updateVinylAnimation();
            this.updateTonearm();
            this.updatePowerLight();
            this.updateTrackVinyls();
        }
    }

    updatePlayButton() {
        const playIcon = document.getElementById('play-icon');
        const playPauseBtn = document.getElementById('play-pause-btn');
        
        if (playIcon) {
            playIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        if (playPauseBtn) {
            if (this.isPlaying) {
                playPauseBtn.classList.add('active');
            } else {
                playPauseBtn.classList.remove('active');
            }
        }
    }

    previousTrack() {
        let newIndex = this.currentTrackIndex - 1;
        if (newIndex < 0) {
            newIndex = this.tracks.length - 1;
        }
        this.loadTrack(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextTrack() {
        let newIndex = this.currentTrackIndex + 1;
        if (newIndex >= this.tracks.length) {
            newIndex = 0;
        }
        this.loadTrack(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    toggleLoop() {
        this.isLooping = !this.isLooping;
        const loopBtn = document.getElementById('loop-btn');
        if (loopBtn) {
            if (this.isLooping) {
                loopBtn.classList.add('active');
            } else {
                loopBtn.classList.remove('active');
            }
        }
        
        if (this.audio) {
            this.audio.loop = this.isLooping;
        }
    }

    handleTrackEnd() {
        if (!this.isLooping) {
            this.nextTrack();
        }
    }

    seekToPosition(e) {
        if (!this.audio || !this.audio.duration) return;
        
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        this.audio.currentTime = percentage * this.audio.duration;
        this.updateProgress();
    }

    updateProgress() {
        if (!this.audio || !this.audio.duration) return;
        
        const percentage = (this.audio.currentTime / this.audio.duration) * 100;
        
        const progressFill = document.getElementById('progress-fill');
        const progressNeedle = document.getElementById('progress-needle');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressNeedle) {
            progressNeedle.style.left = `${percentage}%`;
        }
    }

    updateTimeDisplay() {
        if (!this.audio) return;
        
        const currentTime = this.formatTime(this.audio.currentTime || 0);
        const totalTime = this.formatTime(this.audio.duration || 0);
        
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
        
        if (currentTimeEl) {
            currentTimeEl.textContent = currentTime;
        }
        if (totalTimeEl) {
            totalTimeEl.textContent = totalTime;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update knob rotation based on volume
        this.volumeKnobRotation = 180 + (this.volume * 180);
        
        if (this.audio) {
            this.audio.volume = this.isMuted ? 0 : this.volume;
        }
        
        this.updateVolumeKnobVisual();
        this.updateVolumeIcon();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.audio) {
            this.audio.volume = this.isMuted ? 0 : this.volume;
        }
        
        this.updateVolumeIcon();
    }

    updateVolumeIcon() {
        const volumeIcon = document.getElementById('volume-icon');
        const volumeBtn = document.getElementById('volume-btn');
        
        if (volumeIcon && volumeBtn) {
            if (this.isMuted || this.volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute';
                volumeBtn.classList.add('muted');
            } else if (this.volume < 0.5) {
                volumeIcon.className = 'fas fa-volume-down';
                volumeBtn.classList.remove('muted');
            } else {
                volumeIcon.className = 'fas fa-volume-up';
                volumeBtn.classList.remove('muted');
            }
        }
    }
}

// Initialize the vinyl player when the DOM is loaded
let vinylPlayer;

function initVinylPlayer() {
    console.log('Initializing Vinyl Player...');
    vinylPlayer = new VinylPlayer();
}

// Export for global access
if (typeof window !== 'undefined') {
    window.VinylPlayer = VinylPlayer;
    window.initVinylPlayer = initVinylPlayer;
    window.vinylPlayer = vinylPlayer;
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVinylPlayer);
} else {
    initVinylPlayer();
}