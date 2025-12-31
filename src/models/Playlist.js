/**
 * Playlist model for managing collections of tracks
 */
class Playlist {
  /**
   * @param {Object} options - Playlist options
   * @param {string} options.id - Unique playlist identifier
   * @param {string} options.name - Playlist name
   * @param {Array<Track>} [options.tracks] - Initial tracks
   */
  constructor({ id, name, tracks = [] }) {
    this.id = id;
    this.name = name;
    this.tracks = [...tracks];
  }

  /**
   * Add a track to the playlist
   * @param {Track} track - Track to add
   */
  addTrack(track) {
    this.tracks.push(track);
  }

  /**
   * Remove a track from the playlist
   * @param {string} trackId - ID of track to remove
   * @returns {boolean} True if track was removed
   */
  removeTrack(trackId) {
    const initialLength = this.tracks.length;
    this.tracks = this.tracks.filter(track => track.id !== trackId);
    return this.tracks.length < initialLength;
  }

  /**
   * Get track by ID
   * @param {string} trackId - Track ID
   * @returns {Track|undefined} Track or undefined if not found
   */
  getTrack(trackId) {
    return this.tracks.find(track => track.id === trackId);
  }

  /**
   * Get track by index
   * @param {number} index - Track index
   * @returns {Track|undefined} Track or undefined if index out of bounds
   */
  getTrackByIndex(index) {
    return this.tracks[index];
  }

  /**
   * Get total number of tracks
   * @returns {number} Number of tracks
   */
  getTrackCount() {
    return this.tracks.length;
  }

  /**
   * Clear all tracks from playlist
   */
  clear() {
    this.tracks = [];
  }
}

export default Playlist;
