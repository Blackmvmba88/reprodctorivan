# Modular Music Player

A fully modular music player application with clean architecture and separation of concerns.

## Features

- ✅ **Modular Architecture**: Clear separation between core logic, audio engine, UI, and data models
- ✅ **Complete Player Controls**: Play, pause, stop, seek, next, previous, and volume control
- ✅ **Playlist Management**: Add, remove, and navigate through tracks
- ✅ **Queue System**: Advanced queue management with shuffle and repeat modes
- ✅ **Audio Abstraction**: Pluggable audio engine interface (HTML5 Audio implementation included)
- ✅ **State Management**: Comprehensive state tracking (PLAYING, PAUSED, STOPPED, LOADING)
- ✅ **Track Metadata**: Support for title, artist, duration, album, and artwork
- ✅ **Event System**: Rich event system for tracking player state changes
- ✅ **Responsive UI**: Beautiful, modern user interface

## Project Structure

```
src/
├── models/              # Data models
│   ├── Track.js         # Track metadata model
│   ├── Playlist.js      # Playlist collection model
│   └── PlaybackState.js # Playback state enumeration
├── audio/               # Audio abstraction layer
│   ├── AudioEngine.js   # Audio engine interface
│   └── HTML5AudioEngine.js # HTML5 Audio implementation
├── core/                # Core player logic
│   ├── PlayerEngine.js  # Main player engine
│   └── QueueManager.js  # Queue and playlist management
├── state/               # State management
│   └── StateManager.js  # Application state manager
├── ui/                  # User interface
│   └── PlayerUI.js      # Player UI component
└── index.js             # Main exports
```

## Getting Started

### Basic Usage

1. Open `index.html` in a modern web browser to see the demo
2. The player will load with sample tracks ready to play

### Using in Your Project

```javascript
import { Track, Playlist, PlayerEngine, PlayerUI } from './src/index.js';

// Create tracks
const track1 = new Track({
    id: '1',
    title: 'My Song',
    artist: 'My Artist',
    duration: 180,
    url: 'path/to/audio.mp3'
});

// Create playlist
const playlist = new Playlist({
    id: 'my-playlist',
    name: 'My Playlist',
    tracks: [track1]
});

// Initialize player
const player = new PlayerEngine();
player.getQueueManager().setPlaylist(playlist);

// Create UI (optional)
const container = document.getElementById('player-container');
const ui = new PlayerUI(player, container);
ui.updatePlaylist();

// Control playback
await player.play();
player.pause();
player.stop();
player.next();
player.previous();
player.setVolume(0.5);
player.seek(30);
```

## API Documentation

### PlayerEngine

Main player controller with full playback control.

**Methods:**
- `play(track?)` - Play current or specified track
- `pause()` - Pause playback
- `stop()` - Stop playback
- `next()` - Play next track
- `previous()` - Play previous track
- `seek(time)` - Seek to specific time (seconds)
- `setVolume(volume)` - Set volume (0.0 to 1.0)
- `getVolume()` - Get current volume
- `getState()` - Get playback state
- `getCurrentTrack()` - Get current track
- `getCurrentTime()` - Get current playback time
- `getDuration()` - Get track duration
- `getQueueManager()` - Get queue manager instance
- `on(event, callback)` - Register event listener
- `off(event, callback)` - Unregister event listener

**Events:**
- `statechange` - Playback state changed
- `trackchange` - Track changed
- `trackended` - Track finished playing
- `timeupdate` - Playback time updated
- `volumechange` - Volume changed
- `error` - Error occurred

### QueueManager

Manages playlist and playback queue.

**Methods:**
- `setPlaylist(playlist)` - Set active playlist
- `addTrack(track)` - Add track to queue
- `removeTrack(trackId)` - Remove track from queue
- `getCurrentTrack()` - Get current track
- `next()` - Move to next track
- `previous()` - Move to previous track
- `jumpToTrack(index)` - Jump to track by index
- `jumpToTrackById(trackId)` - Jump to track by ID
- `hasNext()` - Check if next track exists
- `hasPrevious()` - Check if previous track exists
- `setRepeat(enabled)` - Enable/disable repeat mode
- `setShuffle(enabled)` - Enable/disable shuffle mode
- `getTracks()` - Get all tracks
- `getTrackCount()` - Get track count
- `clear()` - Clear queue

### Track

Represents a music track with metadata.

**Constructor:**
```javascript
new Track({
    id: string,
    title: string,
    artist: string,
    duration: number,
    url: string,
    album?: string,
    artwork?: string
})
```

**Methods:**
- `getFormattedDuration()` - Get formatted duration (MM:SS)

### Playlist

Collection of tracks.

**Constructor:**
```javascript
new Playlist({
    id: string,
    name: string,
    tracks?: Track[]
})
```

**Methods:**
- `addTrack(track)` - Add track
- `removeTrack(trackId)` - Remove track
- `getTrack(trackId)` - Get track by ID
- `getTrackByIndex(index)` - Get track by index
- `getTrackCount()` - Get track count
- `clear()` - Clear all tracks

### PlaybackState

Enumeration of playback states:
- `PLAYING` - Audio is playing
- `PAUSED` - Audio is paused
- `STOPPED` - Audio is stopped
- `LOADING` - Audio is loading

### AudioEngine

Abstract interface for audio implementations. Create custom audio engines by extending this class.

### HTML5AudioEngine

HTML5 Audio API implementation of AudioEngine.

## Architecture

### Separation of Concerns

1. **Models (`/models`)**: Pure data structures with no business logic
2. **Audio Layer (`/audio`)**: Abstraction over audio APIs, easily swappable
3. **Core Logic (`/core`)**: Business logic for player and queue management
4. **State Management (`/state`)**: Centralized state management
5. **UI (`/ui`)**: Presentation layer, completely decoupled from core logic

### Design Patterns

- **Abstraction**: Audio engine interface allows different implementations
- **Observer**: Event system for loose coupling between components
- **Facade**: PlayerEngine provides simple interface to complex subsystems
- **Strategy**: Pluggable audio engine implementations

## Extending the Player

### Custom Audio Engine

```javascript
import AudioEngine from './src/audio/AudioEngine.js';

class CustomAudioEngine extends AudioEngine {
    // Implement all required methods
    load(url) { /* ... */ }
    play() { /* ... */ }
    pause() { /* ... */ }
    // ... etc
}

// Use custom engine
const player = new PlayerEngine({
    audioEngine: new CustomAudioEngine()
});
```

### Custom UI

The UI is completely decoupled from the core logic. Create your own UI by listening to player events:

```javascript
player.on('trackchange', (track) => {
    // Update your UI
});

player.on('statechange', (state) => {
    // Update your UI
});

player.on('timeupdate', ({ currentTime, duration }) => {
    // Update your UI
});
```

## Browser Compatibility

- Modern browsers with ES6 module support
- HTML5 Audio API support required
- Tested on Chrome, Firefox, Safari, and Edge

## License

MIT

## Contributing

Contributions are welcome! Please ensure code follows the existing architecture and patterns.
