/**
 * Track model representing a music track with metadata
 */
class Track {
  /**
   * @param {Object} options - Track options
   * @param {string} options.id - Unique track identifier
   * @param {string} options.title - Track title
   * @param {string} options.artist - Track artist
   * @param {number} options.duration - Track duration in seconds
   * @param {string} options.url - Audio file URL
   * @param {string} [options.album] - Album name (optional)
   * @param {string} [options.artwork] - Artwork URL (optional)
   */
  constructor({ id, title, artist, duration, url, album = '', artwork = '' }) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.url = url;
    this.album = album;
    this.artwork = artwork;
  }

  /**
   * Format duration as MM:SS
   * @returns {string} Formatted duration
   */
  getFormattedDuration() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = Math.floor(this.duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default Track;
