/**
 * ProbabilityEngine - Manages probability-based track selection
 * 
 * Instead of deterministic next track selection, this engine maintains
 * a probability field over all available tracks, influenced by:
 * - User interaction patterns
 * - Current energy level
 * - Flow state
 * - Time context
 * - Track history
 */
class ProbabilityEngine {
  constructor() {
    this.trackWeights = new Map(); // trackId -> weight
    this.baseWeight = 1.0;
    this.recentTracks = []; // Recently played track IDs
    this.maxRecentTracks = 5;
    
    // Constants for weight bounds
    this.MIN_WEIGHT = 0.1;
    this.MAX_WEIGHT = 5.0;
  }

  /**
   * Initialize or update track weights for a playlist
   * @param {Array<Track>} tracks - Available tracks
   */
  initializeTracks(tracks) {
    tracks.forEach(track => {
      if (!this.trackWeights.has(track.id)) {
        this.trackWeights.set(track.id, this.baseWeight);
      }
    });
  }

  /**
   * Calculate probability distribution for next track
   * @param {Array<Track>} tracks - Available tracks
   * @param {Object} context - Current listening context
   * @returns {Map<string, number>} Track ID to probability mapping
   */
  calculateProbabilities(tracks, context = {}) {
    const { energy = 0.5, flow = 0.5, hour = 12, skipRate = 0 } = context;
    
    const probabilities = new Map();
    let totalWeight = 0;

    tracks.forEach(track => {
      let weight = this.trackWeights.get(track.id) || this.baseWeight;

      // Reduce probability for recently played tracks
      const recentIndex = this.recentTracks.indexOf(track.id);
      if (recentIndex !== -1) {
        const recency = (this.maxRecentTracks - recentIndex) / this.maxRecentTracks;
        weight *= (1 - recency * 0.7); // Up to 70% reduction for most recent
      }

      // Energy influence (higher energy = prefer different characteristics)
      // This is a placeholder - in reality, tracks would have metadata
      weight *= (1 + (energy - 0.5) * 0.3);

      // Flow state influence (high flow = maintain continuity)
      if (flow > 0.7) {
        // Prefer tracks similar to recent ones (simplified)
        weight *= 1.2;
      } else if (flow < 0.3) {
        // More random selection when flow is broken
        weight *= (0.8 + Math.random() * 0.4);
      }

      // Time of day influence
      const timeWeight = this._getTimeWeight(hour);
      weight *= timeWeight;

      probabilities.set(track.id, Math.max(weight, 0.01));
      totalWeight += probabilities.get(track.id);
    });

    // Normalize to probabilities (sum to 1)
    probabilities.forEach((weight, trackId) => {
      probabilities.set(trackId, weight / totalWeight);
    });

    return probabilities;
  }

  /**
   * Select next track based on probability distribution
   * @param {Array<Track>} tracks - Available tracks
   * @param {Object} context - Current listening context
   * @returns {Track|null} Selected track
   */
  selectNextTrack(tracks, context = {}) {
    if (tracks.length === 0) return null;

    const probabilities = this.calculateProbabilities(tracks, context);
    
    // Weighted random selection
    const random = Math.random();
    let cumulative = 0;
    
    for (const track of tracks) {
      cumulative += probabilities.get(track.id) || 0;
      if (random < cumulative) {
        this._recordSelection(track.id);
        return track;
      }
    }

    // Fallback to last track (should rarely happen due to floating point)
    const fallback = tracks[tracks.length - 1];
    this._recordSelection(fallback.id);
    return fallback;
  }

  /**
   * Update track weight based on listening behavior
   * @param {string} trackId - Track ID
   * @param {Object} feedback - Listening feedback
   */
  updateTrackWeight(trackId, feedback = {}) {
    const { 
      listenPercentage = 1.0,  // How much of the track was listened to
      skipped = false,          // Was it skipped?
      volumeChanges = 0,        // Number of volume changes during track
      paused = false            // Was it paused?
    } = feedback;

    let currentWeight = this.trackWeights.get(trackId) || this.baseWeight;
    
    // Positive feedback for high listen percentage
    if (listenPercentage > 0.8) {
      currentWeight *= 1.1;
    }
    
    // Negative feedback for skips
    if (skipped) {
      currentWeight *= 0.6;
    }
    
    // Negative feedback for pauses (indicates disengagement)
    if (paused) {
      currentWeight *= 0.9;
    }
    
    // High volume changes might indicate engagement or dissatisfaction
    // Keep it neutral for now
    if (volumeChanges > 3) {
      currentWeight *= 1.05;
    }

    // Keep weights in reasonable bounds
    currentWeight = Math.max(this.MIN_WEIGHT, Math.min(currentWeight, this.MAX_WEIGHT));
    
    this.trackWeights.set(trackId, currentWeight);
  }

  /**
   * Get time-based weight modifier
   * @private
   * @param {number} hour - Hour of day (0-23)
   * @returns {number} Weight modifier
   */
  _getTimeWeight(hour) {
    // Morning (6-11): 1.0
    // Afternoon (12-17): 1.1
    // Evening (18-23): 1.2
    // Night (0-5): 0.9
    if (hour >= 6 && hour < 12) return 1.0;
    if (hour >= 12 && hour < 18) return 1.1;
    if (hour >= 18 && hour < 24) return 1.2;
    return 0.9;
  }

  /**
   * Record track selection to recent history
   * @private
   * @param {string} trackId - Selected track ID
   */
  _recordSelection(trackId) {
    this.recentTracks.unshift(trackId);
    if (this.recentTracks.length > this.maxRecentTracks) {
      this.recentTracks.pop();
    }
  }

  /**
   * Get current track weights (for debugging/visualization)
   * @returns {Map<string, number>} Track weights
   */
  getTrackWeights() {
    return new Map(this.trackWeights);
  }

  /**
   * Reset all weights and history
   */
  reset() {
    this.trackWeights.clear();
    this.recentTracks = [];
  }

  /**
   * Get probability distribution as object (for debugging)
   * @param {Array<Track>} tracks - Available tracks
   * @param {Object} context - Current context
   * @returns {Object} Track ID to probability mapping
   */
  getProbabilityDistribution(tracks, context = {}) {
    const probMap = this.calculateProbabilities(tracks, context);
    const result = {};
    probMap.forEach((prob, trackId) => {
      result[trackId] = prob;
    });
    return result;
  }
}

export default ProbabilityEngine;
