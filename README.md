# Retro Desktop with Mixtape.app & Settings.app

A nostalgic retro desktop website inspired by Poolsuite.net aesthetic, featuring two embedded applications: a vintage cassette music player and a classic control panel.

## 🎵 Features

### Mixtape.app - Vintage Cassette Player
- **Authentic cassette design** with animated reels that spin during playback
- **Music controls**: Play/Pause, Previous/Next, Loop toggle
- **Track display** with title and artist information
- **Volume control** with visual feedback
- **Progress bar** with seek functionality
- **Playlist view** with track selection
- **Responsive design** for mobile compatibility

### Settings.app - Retro Control Panel
- **Theme System**: Switch between Retro, Dark, Light, and Cyberpunk themes
- **Wallpaper Controls**: Choose from gradient, stars, grid, and wave backgrounds
- **Audio Management**: Master volume, music volume, and mute controls
- **Visual Effects**: Toggle CRT effects, particles, and animations
- **System Settings**: Desktop behavior, time format, and system information
- **Persistent Settings**: Saves preferences to localStorage

### Desktop Environment
- **Draggable windows** with minimize, maximize, and close controls
- **Start menu** with application launcher
- **Taskbar** with active window management
- **Boot screen** with loading animation
- **CRT monitor effects** with scanlines and flicker
- **Particle effects** for enhanced visual appeal
- **Cursor trail** effect
- **Keyboard shortcuts** (Alt+Tab to cycle windows)

## 📁 Project Structure

```
retro-desktop/
├── index.html              # Main desktop HTML
├── styles/
│   └── retro.css          # Main desktop styles
├── scripts/
│   └── desktop.js         # Desktop functionality
├── components/
│   ├── mixtape.html       # Mixtape app HTML (embedded in index.html)
│   ├── mixtape.css        # Mixtape app styles
│   ├── mixtape.js         # Mixtape app functionality
│   ├── settings.html      # Settings app HTML (embedded in index.html)
│   ├── settings.css       # Settings app styles
│   └── settings.js        # Settings app functionality
├── public/
│   └── tracks/            # Music files directory
│       ├── track1.mp3     # Sample track 1
│       ├── track2.mp3     # Sample track 2
│       └── track3.mp3     # Sample track 3
└── README.md              # This file
```

## 🚀 Getting Started

### Local Development
1. Clone or download the project files
2. Replace placeholder MP3 files in `/public/tracks/` with actual audio files
3. Open `index.html` in a modern web browser
4. Enjoy the retro desktop experience!

### Vercel Deployment
1. Upload the project to your Vercel account
2. Ensure all file paths are correctly configured
3. Add your MP3 files to the `/public/tracks/` directory
4. Deploy and share your retro desktop!

## 🎨 Customization

### Adding New Tracks
1. Place MP3 files in `/public/tracks/`
2. Update the track list in `components/mixtape.js`
3. Modify the `tracks` array with your song information:

```javascript
const tracks = [
    {
        title: "Your Song Title",
        artist: "Artist Name",
        file: "public/tracks/your-song.mp3"
    }
];
```

### Customizing Themes
1. Edit CSS custom properties in `components/settings.js`
2. Add new theme options in the `applyTheme()` method
3. Create corresponding CSS classes in the stylesheets

### Adding New Wallpapers
1. Define new wallpaper options in `components/settings.js`
2. Add CSS classes for the new backgrounds
3. Update the wallpaper selection UI

## 🎯 Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (some CSS effects may vary)
- **Mobile browsers**: Responsive design with touch support

## 🔧 Technical Details

### Dependencies
- **Font Awesome 6.0.0**: Icons
- **Google Fonts**: Press Start 2P, VT323
- **Vanilla JavaScript**: No frameworks required
- **CSS3**: Modern features (Grid, Flexbox, Animations)

### Audio Support
- Uses HTML5 `<audio>` element
- Supports MP3, WAV, OGG formats
- Cross-browser audio compatibility
- Volume and playback controls

### Performance
- Optimized CSS animations
- Efficient DOM manipulation
- Minimal JavaScript footprint
- Responsive image handling

## 🎮 Easter Eggs

- **Ctrl+Alt+Delete**: Triggers a retro BSOD screen
- **Boot sequence**: Authentic startup experience
- **Sound effects**: Simulated system sounds (console logs)
- **Cursor trail**: Cyberpunk-style mouse tracking

## 🛠️ Development Notes

### File Organization
- Each app is modular with separate HTML, CSS, and JS files
- Components are integrated into the main desktop environment
- Settings persist across browser sessions
- Clean separation of concerns

### Styling Approach
- Poolsuite.net inspired color palette
- Retro UI elements (beveled borders, pixel fonts)
- CSS Grid and Flexbox for layouts
- Responsive design principles

### JavaScript Architecture
- Class-based desktop management
- Event-driven window system
- Modular app initialization
- LocalStorage for persistence

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Enjoy your trip back to the golden age of computing!** 🕹️✨

## 🎯 Features

### 🖼️ Visual Design
- **Retro Aesthetic**: Authentic Windows 95/XP styling with pixel fonts and classic UI elements
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Classic Color Scheme**: Grey, beige, light blue, and teal color palette
- **Retro Typography**: Uses Press Start 2P and VT323 fonts for authentic feel

### 🪟 Window Management
- **Draggable Windows**: Click and drag window headers to move them around
- **Window Controls**: Minimize, maximize, and close buttons
- **Z-Index Management**: Clicked windows automatically come to the front
- **Resizable Windows**: Windows can be resized by dragging corners

### 🖱️ Desktop Icons
- **Clickable Icons**: Single-click to open applications
- **Double-Click Support**: Enhanced interaction for desktop icons
- **Hover Effects**: Visual feedback when hovering over icons
- **6 Applications**: My Projects, About Me, Resume.pdf, Recycle Bin, Paint, Notepad

### 🚀 Start Menu
- **Bottom-Left Corner**: Classic Windows start button
- **Application List**: Quick access to all desktop applications
- **Shutdown Option**: Simulated shutdown functionality
- **Keyboard Shortcuts**: ESC to close, Alt+Tab to cycle windows

### 📊 Taskbar
- **Live Clock**: Real-time clock and date display
- **Window Management**: Shows all open windows with click-to-focus
- **Active Window Highlighting**: Currently active window is highlighted
- **Responsive Layout**: Adapts to different screen sizes

### 🎨 Applications

#### 📁 My Projects
- Portfolio-style window showing project list
- Icons for different project types
- Expandable content area

#### 👤 About Me
- Personal bio and information
- Contact details
- Skills and interests

#### 📄 Resume.pdf
- Simulated PDF viewer
- Professional resume layout
- Document-style interface

#### 🗑️ Recycle Bin
- Classic empty recycle bin message
- Retro icon and styling
- Humorous "no files to recover" message

#### 🎨 Paint
- **Functional Drawing Canvas**: Click and drag to draw
- **Color Picker**: Choose from any color
- **Drawing Tools**: Pencil, eraser, and fill tools
- **Real-time Drawing**: Smooth drawing experience

#### 📝 Notepad
- **Text Editor**: Full-featured text area
- **Pre-loaded Content**: Welcome message and instructions
- **Typing Experience**: Classic monospace font

### 🎮 Interactive Features
- **Boot Screen**: Animated loading screen on startup
- **Sound Effects**: Simulated retro sound effects (console logs)
- **Keyboard Shortcuts**: 
  - `Alt + Tab`: Cycle through open windows
  - `ESC`: Close start menu
  - `Ctrl + Alt + Delete`: Easter egg BSOD screen
- **Easter Eggs**: Blue screen of death simulation

## 🛠️ Technical Stack

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with retro aesthetics
- **Vanilla JavaScript**: No frameworks, pure ES6+ code
- **Font Awesome**: Free icon library
- **Google Fonts**: Press Start 2P and VT323 fonts

## 📁 File Structure

```
retro-desktop/
├── index.html          # Main HTML file
├── styles/
│   └── retro.css      # All styling and responsive design
├── scripts/
│   └── desktop.js     # All interactive functionality
└── README.md          # This documentation
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Open `index.html`** in any modern web browser
3. **Enjoy the retro experience!**

### Browser Compatibility
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## 🎮 How to Use

### Opening Applications
- **Click desktop icons** to open applications
- **Use the Start menu** for alternative access
- **Double-click** for enhanced interaction

### Managing Windows
- **Drag window headers** to move windows
- **Click minimize/maximize/close** buttons
- **Click taskbar items** to focus windows
- **Use Alt+Tab** to cycle through windows

### Drawing in Paint
- **Click and drag** on the canvas to draw
- **Choose colors** with the color picker
- **Select tools** from the toolbar
- **Create pixel art** masterpieces!

### Keyboard Shortcuts
- `Alt + Tab`: Cycle through open windows
- `ESC`: Close start menu
- `Ctrl + Alt + Delete`: Trigger BSOD easter egg

## 🎨 Customization

### Adding New Applications
1. Add desktop icon in `index.html`
2. Create window HTML structure
3. Add CSS styling in `retro.css`
4. Update JavaScript in `desktop.js`

### Changing Colors
Modify the CSS variables in `retro.css`:
```css
:root {
    --primary-color: #000080;
    --secondary-color: #c0c0c0;
    --accent-color: #008000;
}
```

### Adding Sound Effects
Replace console.log statements in `desktop.js` with actual audio:
```javascript
function playSound(soundFile) {
    const audio = new Audio(`sounds/${soundFile}.mp3`);
    audio.play();
}
```

## 🌟 Features in Detail

### Responsive Design
- **Desktop**: Full-featured experience with all windows
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Compact design with essential functionality

### Performance
- **Lightweight**: No heavy frameworks or dependencies
- **Fast Loading**: Optimized assets and minimal HTTP requests
- **Smooth Animations**: CSS transitions and transforms
- **Memory Efficient**: Clean JavaScript with proper event handling

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Semantic HTML structure
- **High Contrast**: Clear visual hierarchy
- **Focus Indicators**: Visible focus states

## 🐛 Known Issues

- **Mobile Drawing**: Paint app may have touch sensitivity issues on some devices
- **Window Resizing**: Some browsers may handle resize differently
- **Sound Effects**: Currently simulated (console logs only)

## 🤝 Contributing

Feel free to contribute to this project! Some ideas:
- Add more applications (Calculator, Minesweeper, etc.)
- Implement actual sound effects
- Add more easter eggs
- Improve mobile experience
- Add themes (Windows 98, XP, etc.)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Windows 95/XP** for the nostalgic inspiration
- **Font Awesome** for the excellent icon library
- **Google Fonts** for the retro typography
- **The retro computing community** for keeping the classics alive

---

**Enjoy your trip back to the golden age of computing! 🕹️**

*"The future is now, but the past is forever."*