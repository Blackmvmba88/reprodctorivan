import Playlist from '../models/Playlist.js';

/**
 * Queue Manager for handling playback queue and playlist management
 */
class QueueManager {
  /**
   * @param {Playlist} playlist - Initial playlist
   */
  constructor(playlist = null) {
    this.playlist = playlist || new Playlist({ id: 'default', name: 'Default Queue' });
    this.currentIndex = -1;
    this.repeat = false;
    this.shuffle = false;
    this.shuffledIndices = [];
  }

  /**
   * Set the playlist
   * @param {Playlist} playlist - Playlist to set
   */
  setPlaylist(playlist) {
    this.playlist = playlist;
    this.currentIndex = -1;
    this._updateShuffledIndices();
  }

  /**
   * Add track to queue
   * @param {Track} track - Track to add
   */
  addTrack(track) {
    this.playlist.addTrack(track);
    this._updateShuffledIndices();
  }

  /**
   * Remove track from queue
   * @param {string} trackId - Track ID to remove
   * @returns {boolean} True if removed
   */
  removeTrack(trackId) {
    const removed = this.playlist.removeTrack(trackId);
    if (removed) {
      this._updateShuffledIndices();
    }
    return removed;
  }

  /**
   * Get current track
   * @returns {Track|null} Current track or null
   */
  getCurrentTrack() {
    if (this.currentIndex === -1 || this.playlist.getTrackCount() === 0) {
      return null;
    }
    const actualIndex = this.shuffle ? this.shuffledIndices[this.currentIndex] : this.currentIndex;
    return this.playlist.getTrackByIndex(actualIndex);
  }

  /**
   * Move to next track
   * @returns {Track|null} Next track or null
   */
  next() {
    if (this.playlist.getTrackCount() === 0) {
      return null;
    }

    if (this.currentIndex < this.playlist.getTrackCount() - 1) {
      this.currentIndex++;
    } else if (this.repeat) {
      this.currentIndex = 0;
    } else {
      return null;
    }

    return this.getCurrentTrack();
  }

  /**
   * Move to previous track
   * @returns {Track|null} Previous track or null
   */
  previous() {
    if (this.playlist.getTrackCount() === 0) {
      return null;
    }

    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.repeat) {
      this.currentIndex = this.playlist.getTrackCount() - 1;
    } else {
      return null;
    }

    return this.getCurrentTrack();
  }

  /**
   * Jump to specific track by index
   * @param {number} index - Track index
   * @returns {Track|null} Track at index or null
   */
  jumpToTrack(index) {
    if (index >= 0 && index < this.playlist.getTrackCount()) {
      this.currentIndex = index;
      return this.getCurrentTrack();
    }
    return null;
  }

  /**
   * Jump to specific track by ID
   * @param {string} trackId - Track ID
   * @returns {Track|null} Track or null if not found
   */
  jumpToTrackById(trackId) {
    const index = this.playlist.tracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      return this.jumpToTrack(index);
    }
    return null;
  }

  /**
   * Check if there is a next track
   * @returns {boolean} True if next track exists
   */
  hasNext() {
    return this.currentIndex < this.playlist.getTrackCount() - 1 || this.repeat;
  }

  /**
   * Check if there is a previous track
   * @returns {boolean} True if previous track exists
   */
  hasPrevious() {
    return this.currentIndex > 0 || this.repeat;
  }

  /**
   * Set repeat mode
   * @param {boolean} enabled - Enable repeat
   */
  setRepeat(enabled) {
    this.repeat = enabled;
  }

  /**
   * Set shuffle mode
   * @param {boolean} enabled - Enable shuffle
   */
  setShuffle(enabled) {
    this.shuffle = enabled;
    if (enabled) {
      this._updateShuffledIndices();
    }
  }

  /**
   * Update shuffled indices
   * @private
   */
  _updateShuffledIndices() {
    if (!this.shuffle) {
      this.shuffledIndices = [];
      return;
    }

    const count = this.playlist.getTrackCount();
    this.shuffledIndices = Array.from({ length: count }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledIndices[i], this.shuffledIndices[j]] = 
        [this.shuffledIndices[j], this.shuffledIndices[i]];
    }
  }

  /**
   * Get all tracks
   * @returns {Array<Track>} All tracks
   */
  getTracks() {
    return this.playlist.tracks;
  }

  /**
   * Get track count
   * @returns {number} Number of tracks
   */
  getTrackCount() {
    return this.playlist.getTrackCount();
  }

  /**
   * Clear queue
   */
  clear() {
    this.playlist.clear();
    this.currentIndex = -1;
    this.shuffledIndices = [];
  }
}

export default QueueManager;
