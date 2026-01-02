import PlaybackState from '../models/PlaybackState.js';
import HTML5AudioEngine from '../audio/HTML5AudioEngine.js';
import QueueManager from './QueueManager.js';
import InteractionTracker from '../runtime/InteractionTracker.js';
import RuntimeClock from '../runtime/RuntimeClock.js';

/**
 * Music Runtime Engine - Orchestrates musical states and consciousness
 * 
 * Not a music player - a runtime engine that:
 * - Orchestrates states, not just playback
 * - Responds to observer interaction
 * - Maintains separate audio and runtime time
 * - Enables emergent behavior through probability
 */
class PlayerEngine {
  /**
   * @param {Object} options - Player options
   * @param {AudioEngine} [options.audioEngine] - Custom audio engine (defaults to HTML5AudioEngine)
   * @param {QueueManager} [options.queueManager] - Custom queue manager
   */
  constructor({ audioEngine = null, queueManager = null } = {}) {
    this.audioEngine = audioEngine || new HTML5AudioEngine();
    this.queueManager = queueManager || new QueueManager();
    this.state = PlaybackState.STOPPED;
    this.currentTrack = null;
    this.eventListeners = {};
    
    // Runtime components
    this.interactionTracker = new InteractionTracker();
    this.runtimeClock = new RuntimeClock();
    this._previousVolume = 1.0;
    this._trackStartTime = 0;
    
    // Start runtime clock
    this._startClockTick();
    
    this._setupAudioEngineListeners();
  }

  /**
   * Start runtime clock tick
   * @private
   */
  _startClockTick() {
    setInterval(() => {
      this.runtimeClock.tick();
    }, 100); // Tick every 100ms
  }

  /**
   * Setup audio engine event listeners
   * @private
   */
  _setupAudioEngineListeners() {
    this.audioEngine.on('play', () => {
      this.state = PlaybackState.PLAYING;
      this._emit('statechange', this.state);
    });

    this.audioEngine.on('pause', () => {
      this.state = PlaybackState.PAUSED;
      this._emit('statechange', this.state);
    });

    this.audioEngine.on('ended', () => {
      this._handleTrackEnded();
    });

    this.audioEngine.on('timeupdate', (time) => {
      this._emit('timeupdate', {
        currentTime: time,
        duration: this.audioEngine.getDuration()
      });
    });

    this.audioEngine.on('error', (error) => {
      this.state = PlaybackState.STOPPED;
      this._emit('error', error);
      this._emit('statechange', this.state);
    });

    this.audioEngine.on('loading', () => {
      this.state = PlaybackState.LOADING;
      this._emit('statechange', this.state);
    });
  }

  /**
   * Handle track ended event
   * @private
   */
  async _handleTrackEnded() {
    this.state = PlaybackState.STOPPED;
    this._emit('trackended', this.currentTrack);
    
    // Auto-play next track if available
    const nextTrack = this.queueManager.next();
    if (nextTrack) {
      await this.play();
    } else {
      this._emit('statechange', this.state);
    }
  }

  /**
   * Emit event to registered listeners
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  _emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Play current or specified track
   * @param {Track} [track] - Track to play (optional, uses current from queue if not specified)
   * @returns {Promise<void>}
   */
  async play(track = null) {
    try {
      if (track) {
        // Complete previous track if it was playing
        if (this.currentTrack && this.state === PlaybackState.PLAYING) {
          const listenTime = this.getCurrentTime();
          this.interactionTracker.completeTrack(listenTime);
        }
        
        // Play specific track
        this.currentTrack = track;
        this.state = PlaybackState.LOADING;
        this._emit('statechange', this.state);
        this._emit('trackchange', track);
        
        // Track runtime clock state
        this._trackStartTime = this.runtimeClock.getInternalTime();
        this.interactionTracker.startTrack(track.duration);
        this.runtimeClock.resume();
        
        await this.audioEngine.load(track.url);
        await this.audioEngine.play();
      } else if (this.state === PlaybackState.PAUSED && this.currentTrack) {
        // Resume paused track
        this.runtimeClock.resume();
        await this.audioEngine.play();
      } else {
        // Play current track from queue
        const queueTrack = this.queueManager.getCurrentTrack();
        if (queueTrack) {
          return this.play(queueTrack);
        } else {
          throw new Error('No track to play');
        }
      }
    } catch (error) {
      this.state = PlaybackState.STOPPED;
      this._emit('error', error);
      this._emit('statechange', this.state);
      throw error;
    }
  }

  /**
   * Pause playback
   */
  pause() {
    if (this.state === PlaybackState.PLAYING) {
      const currentTime = this.getCurrentTime();
      const duration = this.getDuration();
      const trackProgress = duration > 0 ? currentTime / duration : 0;
      
      // Record pause interaction
      this.interactionTracker.recordPause(trackProgress);
      this.runtimeClock.pause();
      
      this.audioEngine.pause();
    }
  }

  /**
   * Stop playback
   */
  stop() {
    this.audioEngine.stop();
    this.state = PlaybackState.STOPPED;
    this._emit('statechange', this.state);
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in seconds
   */
  seek(time) {
    this.audioEngine.seek(time);
  }

  /**
   * Set volume
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume) {
    // Record volume change interaction
    this.interactionTracker.recordVolumeChange(this._previousVolume, volume);
    this._previousVolume = volume;
    
    this.audioEngine.setVolume(volume);
    this._emit('volumechange', volume);
  }

  /**
   * Get current volume
   * @returns {number} Volume level (0.0 to 1.0)
   */
  getVolume() {
    return this.audioEngine.getVolume();
  }

  /**
   * Play next track
   * @returns {Promise<void>}
   */
  async next() {
    // Record skip if current track was playing
    if (this.currentTrack && this.state === PlaybackState.PLAYING) {
      const currentTime = this.getCurrentTime();
      const duration = this.getDuration();
      const trackProgress = duration > 0 ? currentTime / duration : 0;
      this.interactionTracker.recordSkip(trackProgress, this.currentTrack.id);
    }
    
    // Get listening context for probability-based selection
    const context = this.interactionTracker.getContext();
    const nextTrack = this.queueManager.next(context);
    
    if (nextTrack) {
      await this.play(nextTrack);
    } else {
      this.stop();
    }
  }

  /**
   * Play previous track
   * @returns {Promise<void>}
   */
  async previous() {
    const previousTrack = this.queueManager.previous();
    if (previousTrack) {
      await this.play(previousTrack);
    } else {
      this.stop();
    }
  }

  /**
   * Get current playback state
   * @returns {string} Current state
   */
  getState() {
    return this.state;
  }

  /**
   * Get current track
   * @returns {Track|null} Current track
   */
  getCurrentTrack() {
    return this.currentTrack;
  }

  /**
   * Get current playback time
   * @returns {number} Current time in seconds
   */
  getCurrentTime() {
    return this.audioEngine.getCurrentTime();
  }

  /**
   * Get track duration
   * @returns {number} Duration in seconds
   */
  getDuration() {
    return this.audioEngine.getDuration();
  }

  /**
   * Register event listener
   * @param {string} event - Event name (play, pause, stop, trackchange, trackended, timeupdate, volumechange, statechange, error)
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Unregister event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Get queue manager
   * @returns {QueueManager} Queue manager instance
   */
  getQueueManager() {
    return this.queueManager;
  }

  /**
   * Get interaction tracker
   * @returns {InteractionTracker} Interaction tracker instance
   */
  getInteractionTracker() {
    return this.interactionTracker;
  }

  /**
   * Get runtime clock
   * @returns {RuntimeClock} Runtime clock instance
   */
  getRuntimeClock() {
    return this.runtimeClock;
  }

  /**
   * Get runtime state - includes both audio and runtime time
   * @returns {Object} Complete runtime state
   */
  getRuntimeState() {
    const context = this.interactionTracker.getContext();
    return {
      playbackState: this.state,
      currentTrack: this.currentTrack,
      audioTime: this.getCurrentTime(),
      runtimeTime: this.runtimeClock.getInternalTime(),
      energy: context.energy,
      flow: context.flow,
      context
    };
  }
}

export default PlayerEngine;
