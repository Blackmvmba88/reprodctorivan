import AudioEngine from './AudioEngine.js';

/**
 * HTML5 Audio implementation of AudioEngine
 */
class HTML5AudioEngine extends AudioEngine {
  constructor() {
    super();
    this.audio = new Audio();
    this.eventListeners = {};
    
    // Setup internal event handlers
    this._setupEventHandlers();
  }

  /**
   * Setup event handlers for HTML5 Audio element
   * @private
   */
  _setupEventHandlers() {
    this.audio.addEventListener('loadedmetadata', () => {
      this._emit('loadedmetadata');
    });

    this.audio.addEventListener('canplay', () => {
      this._emit('canplay');
    });

    this.audio.addEventListener('play', () => {
      this._emit('play');
    });

    this.audio.addEventListener('pause', () => {
      this._emit('pause');
    });

    this.audio.addEventListener('ended', () => {
      this._emit('ended');
    });

    this.audio.addEventListener('timeupdate', () => {
      this._emit('timeupdate', this.audio.currentTime);
    });

    this.audio.addEventListener('error', (e) => {
      this._emit('error', e);
    });

    this.audio.addEventListener('loadstart', () => {
      this._emit('loading');
    });
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
   * Load audio from URL
   * @param {string} url - Audio file URL
   * @returns {Promise<void>}
   */
  async load(url) {
    this.audio.src = url;
    return new Promise((resolve, reject) => {
      const loadHandler = () => {
        this.audio.removeEventListener('canplay', loadHandler);
        this.audio.removeEventListener('error', errorHandler);
        resolve();
      };
      const errorHandler = (e) => {
        this.audio.removeEventListener('canplay', loadHandler);
        this.audio.removeEventListener('error', errorHandler);
        reject(e);
      };
      this.audio.addEventListener('canplay', loadHandler);
      this.audio.addEventListener('error', errorHandler);
      this.audio.load();
    });
  }

  /**
   * Start playback
   * @returns {Promise<void>}
   */
  async play() {
    return this.audio.play();
  }

  /**
   * Pause playback
   */
  pause() {
    this.audio.pause();
  }

  /**
   * Stop playback and reset position
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in seconds
   */
  seek(time) {
    this.audio.currentTime = Math.max(0, Math.min(time, this.getDuration()));
  }

  /**
   * Set volume
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current playback time
   * @returns {number} Current time in seconds
   */
  getCurrentTime() {
    return this.audio.currentTime || 0;
  }

  /**
   * Get duration
   * @returns {number} Duration in seconds
   */
  getDuration() {
    return this.audio.duration || 0;
  }

  /**
   * Get current volume
   * @returns {number} Volume level (0.0 to 1.0)
   */
  getVolume() {
    return this.audio.volume;
  }

  /**
   * Register event listener
   * @param {string} event - Event name (play, pause, ended, timeupdate, error, loading, canplay, loadedmetadata)
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
}

export default HTML5AudioEngine;
