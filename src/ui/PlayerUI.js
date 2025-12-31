/**
 * Player UI - Basic user interface for the music player
 */
class PlayerUI {
  /**
   * @param {PlayerEngine} playerEngine - Player engine instance
   * @param {HTMLElement} container - Container element for the UI
   */
  constructor(playerEngine, container) {
    this.player = playerEngine;
    this.container = container;
    this.elements = {};
    
    this._createUI();
    this._bindEvents();
  }

  /**
   * Create UI elements
   * @private
   */
  _createUI() {
    this.container.innerHTML = `
      <div class="music-player">
        <div class="player-track-info">
          <div class="track-artwork">
            <img src="" alt="Track artwork" class="artwork-image" />
          </div>
          <div class="track-details">
            <div class="track-title">No track loaded</div>
            <div class="track-artist">-</div>
          </div>
        </div>
        
        <div class="player-controls">
          <button class="btn-previous" title="Previous">⏮</button>
          <button class="btn-play" title="Play">▶</button>
          <button class="btn-pause" title="Pause" style="display:none;">⏸</button>
          <button class="btn-stop" title="Stop">⏹</button>
          <button class="btn-next" title="Next">⏭</button>
        </div>
        
        <div class="player-progress">
          <span class="time-current">0:00</span>
          <input type="range" class="seek-bar" min="0" max="100" value="0" />
          <span class="time-duration">0:00</span>
        </div>
        
        <div class="player-volume">
          <span class="volume-icon">🔊</span>
          <input type="range" class="volume-bar" min="0" max="100" value="100" />
        </div>
        
        <div class="player-playlist">
          <h3>Playlist</h3>
          <div class="playlist-tracks"></div>
        </div>
      </div>
    `;

    // Store references to elements
    this.elements = {
      trackTitle: this.container.querySelector('.track-title'),
      trackArtist: this.container.querySelector('.track-artist'),
      artworkImage: this.container.querySelector('.artwork-image'),
      btnPlay: this.container.querySelector('.btn-play'),
      btnPause: this.container.querySelector('.btn-pause'),
      btnStop: this.container.querySelector('.btn-stop'),
      btnNext: this.container.querySelector('.btn-next'),
      btnPrevious: this.container.querySelector('.btn-previous'),
      seekBar: this.container.querySelector('.seek-bar'),
      volumeBar: this.container.querySelector('.volume-bar'),
      timeCurrent: this.container.querySelector('.time-current'),
      timeDuration: this.container.querySelector('.time-duration'),
      playlistTracks: this.container.querySelector('.playlist-tracks')
    };
  }

  /**
   * Bind events
   * @private
   */
  _bindEvents() {
    // Control button events
    this.elements.btnPlay.addEventListener('click', () => this.player.play());
    this.elements.btnPause.addEventListener('click', () => this.player.pause());
    this.elements.btnStop.addEventListener('click', () => this.player.stop());
    this.elements.btnNext.addEventListener('click', () => this.player.next());
    this.elements.btnPrevious.addEventListener('click', () => this.player.previous());

    // Seek bar
    this.elements.seekBar.addEventListener('input', (e) => {
      const time = (e.target.value / 100) * this.player.getDuration();
      this.player.seek(time);
    });

    // Volume bar
    this.elements.volumeBar.addEventListener('input', (e) => {
      this.player.setVolume(e.target.value / 100);
    });

    // Player events
    this.player.on('trackchange', (track) => this._updateTrackInfo(track));
    this.player.on('statechange', (state) => this._updatePlayerState(state));
    this.player.on('timeupdate', (data) => this._updateProgress(data));
    this.player.on('volumechange', (volume) => this._updateVolume(volume));
  }

  /**
   * Update track info display
   * @private
   * @param {Track} track - Current track
   */
  _updateTrackInfo(track) {
    if (track) {
      this.elements.trackTitle.textContent = track.title;
      this.elements.trackArtist.textContent = track.artist;
      if (track.artwork) {
        this.elements.artworkImage.src = track.artwork;
        this.elements.artworkImage.style.display = 'block';
      } else {
        this.elements.artworkImage.style.display = 'none';
      }
    } else {
      this.elements.trackTitle.textContent = 'No track loaded';
      this.elements.trackArtist.textContent = '-';
      this.elements.artworkImage.style.display = 'none';
    }
  }

  /**
   * Update player state display
   * @private
   * @param {string} state - Player state
   */
  _updatePlayerState(state) {
    if (state === 'PLAYING') {
      this.elements.btnPlay.style.display = 'none';
      this.elements.btnPause.style.display = 'inline-block';
    } else {
      this.elements.btnPlay.style.display = 'inline-block';
      this.elements.btnPause.style.display = 'none';
    }
  }

  /**
   * Update progress bar and time display
   * @private
   * @param {Object} data - Time update data
   */
  _updateProgress({ currentTime, duration }) {
    if (duration > 0) {
      this.elements.seekBar.value = (currentTime / duration) * 100;
      this.elements.timeCurrent.textContent = this._formatTime(currentTime);
      this.elements.timeDuration.textContent = this._formatTime(duration);
    }
  }

  /**
   * Update volume display
   * @private
   * @param {number} volume - Volume level
   */
  _updateVolume(volume) {
    this.elements.volumeBar.value = volume * 100;
  }

  /**
   * Format time as MM:SS
   * @private
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time
   */
  _formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Update playlist display
   */
  updatePlaylist() {
    const tracks = this.player.getQueueManager().getTracks();
    const currentTrack = this.player.getCurrentTrack();
    
    this.elements.playlistTracks.innerHTML = tracks.map((track, index) => `
      <div class="playlist-item ${currentTrack && currentTrack.id === track.id ? 'active' : ''}" data-index="${index}">
        <span class="track-number">${index + 1}</span>
        <span class="track-info">
          <span class="track-name">${track.title}</span>
          <span class="track-artist-name">${track.artist}</span>
        </span>
        <span class="track-duration">${track.getFormattedDuration()}</span>
      </div>
    `).join('');

    // Add click handlers for playlist items
    this.elements.playlistTracks.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        const track = this.player.getQueueManager().jumpToTrack(index);
        if (track) {
          this.player.play(track);
        }
      });
    });
  }
}

export default PlayerUI;
