/**
 * InteractionTracker - Monitors and analyzes user interaction patterns
 * 
 * Tracks:
 * - Volume changes (frequency and magnitude)
 * - Pause/resume patterns
 * - Skip frequency
 * - Listen duration per track
 * - Time of day patterns
 */
class InteractionTracker {
  constructor() {
    this.interactions = {
      volumeChanges: [],
      pauses: [],
      skips: [],
      listenDurations: [],
      lastInteractionTime: null
    };
    
    this.metrics = {
      volumeChangeFrequency: 0, // Changes per minute
      pauseFrequency: 0, // Pauses per hour
      skipRate: 0, // Skips per 10 tracks
      averageListenDuration: 0, // Average percentage of track listened
      interactionDensity: 0 // Overall interaction intensity
    };
    
    this.startTime = Date.now();
    this.currentTrackStart = null;
    this.currentTrackDuration = 0;
    
    // Constants for activity calculation
    this.RECENT_ACTIVITY_THRESHOLD_MINUTES = 5;
    this.MAX_INACTIVITY_MINUTES = 30;
  }

  /**
   * Record a volume change interaction
   * @param {number} oldVolume - Previous volume level
   * @param {number} newVolume - New volume level
   */
  recordVolumeChange(oldVolume, newVolume) {
    const now = Date.now();
    this.interactions.volumeChanges.push({
      timestamp: now,
      magnitude: Math.abs(newVolume - oldVolume),
      direction: newVolume > oldVolume ? 'up' : 'down'
    });
    this.interactions.lastInteractionTime = now;
    this._updateMetrics();
  }

  /**
   * Record a pause interaction
   * @param {number} trackProgress - How far into the track (0-1)
   */
  recordPause(trackProgress) {
    const now = Date.now();
    this.interactions.pauses.push({
      timestamp: now,
      trackProgress,
      timeOfDay: new Date(now).getHours()
    });
    this.interactions.lastInteractionTime = now;
    this._updateMetrics();
  }

  /**
   * Record a skip interaction
   * @param {number} trackProgress - How far into the track when skipped (0-1)
   * @param {string} trackId - ID of skipped track
   */
  recordSkip(trackProgress, trackId) {
    const now = Date.now();
    this.interactions.skips.push({
      timestamp: now,
      trackProgress,
      trackId,
      timeOfDay: new Date(now).getHours()
    });
    this.interactions.lastInteractionTime = now;
    this._updateMetrics();
  }

  /**
   * Record track start
   * @param {number} duration - Track duration in seconds
   */
  startTrack(duration) {
    this.currentTrackStart = Date.now();
    this.currentTrackDuration = duration;
  }

  /**
   * Record track completion
   * @param {number} actualListenTime - How long was actually listened in seconds
   */
  completeTrack(actualListenTime) {
    if (this.currentTrackStart && this.currentTrackDuration > 0) {
      const listenPercentage = Math.min(actualListenTime / this.currentTrackDuration, 1);
      this.interactions.listenDurations.push({
        timestamp: Date.now(),
        percentage: listenPercentage,
        duration: actualListenTime
      });
      this._updateMetrics();
    }
    this.currentTrackStart = null;
  }

  /**
   * Update calculated metrics based on interaction history
   * @private
   */
  _updateMetrics() {
    const now = Date.now();
    const runtimeMinutes = (now - this.startTime) / (1000 * 60);
    const runtimeHours = runtimeMinutes / 60;

    // Volume change frequency (per minute)
    this.metrics.volumeChangeFrequency = runtimeMinutes > 0
      ? this.interactions.volumeChanges.length / runtimeMinutes
      : 0;

    // Pause frequency (per hour)
    this.metrics.pauseFrequency = runtimeHours > 0
      ? this.interactions.pauses.length / runtimeHours
      : 0;

    // Skip rate (per 10 tracks)
    const totalTracks = this.interactions.listenDurations.length + this.interactions.skips.length;
    this.metrics.skipRate = totalTracks > 0
      ? (this.interactions.skips.length / totalTracks) * 10
      : 0;

    // Average listen duration percentage
    if (this.interactions.listenDurations.length > 0) {
      const sum = this.interactions.listenDurations.reduce((acc, d) => acc + d.percentage, 0);
      this.metrics.averageListenDuration = sum / this.interactions.listenDurations.length;
    }

    // Interaction density (composite score 0-1)
    const timeSinceLastInteraction = this.interactions.lastInteractionTime
      ? (now - this.interactions.lastInteractionTime) / (1000 * 60) // minutes
      : Infinity;
    
    const recentActivity = timeSinceLastInteraction < this.RECENT_ACTIVITY_THRESHOLD_MINUTES 
      ? 1 
      : Math.max(0, 1 - timeSinceLastInteraction / this.MAX_INACTIVITY_MINUTES);
    const volumeActivity = Math.min(this.metrics.volumeChangeFrequency / 2, 1);
    const pauseActivity = Math.min(this.metrics.pauseFrequency / 3, 1);
    
    this.metrics.interactionDensity = (recentActivity + volumeActivity + pauseActivity) / 3;
  }

  /**
   * Get current metrics
   * @returns {Object} Current interaction metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get energy level based on interactions (0-1)
   * High interaction = high energy
   * @returns {number} Energy level 0-1
   */
  getEnergyLevel() {
    const density = this.metrics.interactionDensity;
    const skipPenalty = Math.min(this.metrics.skipRate / 10, 0.3);
    const pausePenalty = Math.min(this.metrics.pauseFrequency / 10, 0.3);
    
    const energy = Math.max(0, Math.min(1, density - skipPenalty - pausePenalty));
    return energy;
  }

  /**
   * Get flow state score (0-1)
   * High flow = uninterrupted listening, few skips
   * @returns {number} Flow state score 0-1
   */
  getFlowState() {
    const listenCompletion = this.metrics.averageListenDuration;
    const lowInteraction = 1 - Math.min(this.metrics.interactionDensity, 1);
    const lowSkips = 1 - Math.min(this.metrics.skipRate / 10, 1);
    
    const flow = (listenCompletion * 0.4 + lowInteraction * 0.3 + lowSkips * 0.3);
    return Math.max(0, Math.min(1, flow));
  }

  /**
   * Get listening context
   * @returns {Object} Current context including time and patterns
   */
  getContext() {
    const now = new Date();
    return {
      hour: now.getHours(),
      dayOfWeek: now.getDay(),
      energy: this.getEnergyLevel(),
      flow: this.getFlowState(),
      metrics: this.getMetrics()
    };
  }

  /**
   * Reset all tracking data
   */
  reset() {
    this.interactions = {
      volumeChanges: [],
      pauses: [],
      skips: [],
      listenDurations: [],
      lastInteractionTime: null
    };
    this.metrics = {
      volumeChangeFrequency: 0,
      pauseFrequency: 0,
      skipRate: 0,
      averageListenDuration: 0,
      interactionDensity: 0
    };
    this.startTime = Date.now();
  }
}

export default InteractionTracker;
