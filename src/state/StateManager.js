/**
 * State Manager for managing application state
 */
class StateManager {
  constructor() {
    this.state = {
      playbackState: 'STOPPED',
      currentTrack: null,
      currentTime: 0,
      duration: 0,
      volume: 1.0,
      queue: [],
      repeat: false,
      shuffle: false
    };
    this.listeners = [];
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state
   * @param {Object} updates - State updates
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this._notifyListeners();
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Listener function
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   * @private
   */
  _notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export default StateManager;
