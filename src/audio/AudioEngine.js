/**
 * Audio Engine interface
 * Abstract interface for audio playback implementations
 */
class AudioEngine {
  /**
   * Load audio from URL
   * @param {string} url - Audio file URL
   * @returns {Promise<void>}
   */
  load(url) {
    throw new Error('Method load() must be implemented');
  }

  /**
   * Start playback
   * @returns {Promise<void>}
   */
  play() {
    throw new Error('Method play() must be implemented');
  }

  /**
   * Pause playback
   */
  pause() {
    throw new Error('Method pause() must be implemented');
  }

  /**
   * Stop playback and reset position
   */
  stop() {
    throw new Error('Method stop() must be implemented');
  }

  /**
   * Seek to specific time
   * @param {number} time - Time in seconds
   */
  seek(time) {
    throw new Error('Method seek() must be implemented');
  }

  /**
   * Set volume
   * @param {number} volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume) {
    throw new Error('Method setVolume() must be implemented');
  }

  /**
   * Get current playback time
   * @returns {number} Current time in seconds
   */
  getCurrentTime() {
    throw new Error('Method getCurrentTime() must be implemented');
  }

  /**
   * Get duration
   * @returns {number} Duration in seconds
   */
  getDuration() {
    throw new Error('Method getDuration() must be implemented');
  }

  /**
   * Get current volume
   * @returns {number} Volume level (0.0 to 1.0)
   */
  getVolume() {
    throw new Error('Method getVolume() must be implemented');
  }

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    throw new Error('Method on() must be implemented');
  }

  /**
   * Unregister event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    throw new Error('Method off() must be implemented');
  }
}

export default AudioEngine;
