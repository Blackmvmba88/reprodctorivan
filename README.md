# Music Runtime Engine

**Not a music player. A consciousness layer over sound.**

A runtime engine that orchestrates musical states, responds to observer interaction, and enables emergent behavior through probability fields.

> 📖 Read the [MANIFESTO](MANIFESTO.md) to understand what this truly is  
> 🧠 Explore the [PHILOSOPHY](PHILOSOPHY.md) for the conceptual framework

## What Makes This Different

This is **not** another music player. It's a **Music Runtime Engine** that:

- **Orchestrates states**, not just playback sequences
- **Responds to the observer** - your interactions shape the probability field
- **Separates audio time from runtime time** - enabling future generative capabilities
- **Learns without AI** - uses behavioral physics and probability, not neural networks
- **Enables emergence** - behavior patterns arise from the system, not from rules

## Core Concepts

### 1. Non-Linear Playback
The next track doesn't come from a list—it emerges from a **probability field** influenced by:
- How long you listened to the previous track
- Your volume adjustment patterns  
- When and why you skip
- Time of day and context
- System's learned behavior patterns

### 2. Observer Effect
Every interaction changes the system's state:
- Touch volume frequently → system learns you want dynamic control
- Pause often → energy level decreases, influences track selection
- Let it play uninterrupted → flow state activates, maintains continuity

### 3. Temporal Decoupling
- **Audio Time**: Linear progress through the track
- **Runtime Time**: Engine's internal state clock

This separation enables future capabilities:
- Smart crossfades that "feel right"
- Non-synchronized loops
- Layered soundscapes
- Real-time generative audio

## Features

### Runtime Engine Features
- ✅ **Probability-Based Selection**: Next track chosen from weighted probability field
- ✅ **Interaction Tracking**: Monitors volume changes, pauses, skips, listen duration
- ✅ **Energy & Flow States**: System tracks and responds to your listening patterns
- ✅ **Context Awareness**: Time of day and interaction patterns influence behavior
- ✅ **Runtime Clock**: Internal timing separate from audio playback
- ✅ **Emergent Behavior**: Patterns arise from probability, not hard-coded rules

### Traditional Player Features
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
├── core/                # Core engine logic
│   ├── PlayerEngine.js  # Music Runtime Engine (main orchestrator)
│   └── QueueManager.js  # Probability-based queue management
├── runtime/             # Runtime consciousness layer
│   ├── InteractionTracker.js  # User behavior monitoring
│   ├── ProbabilityEngine.js   # Probability field management
│   └── RuntimeClock.js        # Internal timing system
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

#### Traditional Mode (Linear Playback)

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

// Control playback
await player.play();
player.pause();
player.stop();
player.next();
player.previous();
player.setVolume(0.5);
player.seek(30);
```

#### Runtime Engine Mode (Probability-Based)

```javascript
import { PlayerEngine, Playlist, Track } from './src/index.js';

// Create player
const player = new PlayerEngine();

// Enable probability-based selection
player.getQueueManager().setProbabilityMode(true);

// Set up playlist
const playlist = new Playlist({ id: 'runtime', name: 'Runtime Playlist', tracks: [...] });
player.getQueueManager().setPlaylist(playlist);

// The system now learns from your interactions
player.on('trackchange', (track) => {
    console.log('Playing:', track.title);
});

// Access runtime state
setInterval(() => {
    const state = player.getRuntimeState();
    console.log('Energy:', state.energy);
    console.log('Flow:', state.flow);
    console.log('Runtime Time:', state.runtimeTime);
    console.log('Audio Time:', state.audioTime);
}, 5000);

// Get interaction metrics
const tracker = player.getInteractionTracker();
const metrics = tracker.getMetrics();
console.log('Skip rate:', metrics.skipRate);
console.log('Average listen duration:', metrics.averageListenDuration);
```

## API Documentation

### PlayerEngine (Music Runtime Engine)

The core orchestrator that manages states, interactions, and consciousness.

**Core Methods:**
- `play(track?)` - Play current or specified track
- `pause()` - Pause playback (records interaction)
- `stop()` - Stop playback
- `next()` - Play next track (probability-based if enabled)
- `previous()` - Play previous track
- `seek(time)` - Seek to specific time (seconds)
- `setVolume(volume)` - Set volume (0.0 to 1.0, records interaction)
- `getVolume()` - Get current volume
- `getState()` - Get playback state
- `getCurrentTrack()` - Get current track
- `getCurrentTime()` - Get current playback time (audio time)
- `getDuration()` - Get track duration
- `on(event, callback)` - Register event listener
- `off(event, callback)` - Unregister event listener

**Runtime Methods:**
- `getQueueManager()` - Get queue manager instance
- `getInteractionTracker()` - Get interaction tracker instance
- `getRuntimeClock()` - Get runtime clock instance
- `getRuntimeState()` - Get complete runtime state (energy, flow, times, context)

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
