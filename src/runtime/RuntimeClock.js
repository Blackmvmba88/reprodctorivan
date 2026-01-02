/**
 * RuntimeClock - Internal timing system separate from audio playback time
 * 
 * Provides:
 * - Internal state time (independent of audio)
 * - Event timing
 * - Future support for non-linear time effects
 */
class RuntimeClock {
  constructor() {
    this.startTime = Date.now();
    this.internalTime = 0; // Internal time in seconds
    this.timeScale = 1.0; // Time dilation factor (future use)
    this.lastUpdate = Date.now();
    this.paused = false;
    this.events = [];
    
    // Constants for time scale bounds
    this.MIN_TIME_SCALE = 0.1;
    this.MAX_TIME_SCALE = 2.0;
  }

  /**
   * Update internal clock
   * Should be called regularly (e.g., on requestAnimationFrame or interval)
   */
  tick() {
    if (this.paused) return;

    const now = Date.now();
    const deltaMs = now - this.lastUpdate;
    const deltaSeconds = (deltaMs / 1000) * this.timeScale;
    
    this.internalTime += deltaSeconds;
    this.lastUpdate = now;

    // Process scheduled events
    this._processEvents();
  }

  /**
   * Get internal runtime time in seconds
   * @returns {number} Internal time
   */
  getInternalTime() {
    return this.internalTime;
  }

  /**
   * Get real-world elapsed time since start
   * @returns {number} Elapsed time in seconds
   */
  getElapsedTime() {
    return (Date.now() - this.startTime) / 1000;
  }

  /**
   * Pause the internal clock
   */
  pause() {
    this.paused = true;
  }

  /**
   * Resume the internal clock
   */
  resume() {
    if (this.paused) {
      this.paused = false;
      this.lastUpdate = Date.now();
    }
  }

  /**
   * Set time scale (time dilation)
   * @param {number} scale - Time scale factor (1.0 = normal)
   */
  setTimeScale(scale) {
    this.timeScale = Math.max(this.MIN_TIME_SCALE, Math.min(scale, this.MAX_TIME_SCALE));
  }

  /**
   * Schedule an event at a specific internal time
   * @param {number} time - Internal time to trigger
   * @param {Function} callback - Callback to execute
   * @returns {string} Event ID
   */
  scheduleEvent(time, callback) {
    const eventId = `evt_${Date.now()}_${Math.random()}`;
    this.events.push({
      id: eventId,
      time,
      callback,
      triggered: false
    });
    return eventId;
  }

  /**
   * Cancel a scheduled event
   * @param {string} eventId - Event ID to cancel
   */
  cancelEvent(eventId) {
    this.events = this.events.filter(evt => evt.id !== eventId);
  }

  /**
   * Process scheduled events
   * @private
   */
  _processEvents() {
    const currentTime = this.internalTime;
    this.events.forEach(event => {
      if (!event.triggered && currentTime >= event.time) {
        event.triggered = true;
        try {
          event.callback();
        } catch (error) {
          console.error('Runtime clock event error:', error);
        }
      }
    });

    // Clean up triggered events
    this.events = this.events.filter(evt => !evt.triggered);
  }

  /**
   * Reset the clock
   */
  reset() {
    this.startTime = Date.now();
    this.internalTime = 0;
    this.lastUpdate = Date.now();
    this.paused = false;
    this.events = [];
  }

  /**
   * Get clock state
   * @returns {Object} Clock state
   */
  getState() {
    return {
      internalTime: this.internalTime,
      elapsedTime: this.getElapsedTime(),
      timeScale: this.timeScale,
      paused: this.paused,
      scheduledEvents: this.events.length
    };
  }
}

export default RuntimeClock;
