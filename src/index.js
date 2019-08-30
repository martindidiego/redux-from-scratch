import "./styles.css";
// Import our newest creation...
import { createStore, bindActionCreators } from "./redux";

// Stuff for Redux.
import songs from "./songs";
import songReducer from "./songReducer";
import songActions from "./songActions";

/**
 * Collection of DOM element references to save us time.
 */
const elements = {
  player: {
    activeSong: document.getElementById("activeSong"),
    playPauseIcon: document.getElementById("playPauseIcon"),
    nextIcon: document.getElementById("nextIcon"),
    prevIcon: document.getElementById("prevIcon")
  },
  songList: document.querySelector(".song-list")
};

/**
 * Create a song item element for each song in our global state.
 * Each song element will also have a click handler which will
 * dispatch an action to play the given song.
 */
const renderSongList = (songs, activeSong, isPlaying, actions) => {
  const fragment = document.createDocumentFragment();

  /**
   * Note: this is a really inefficient way of updating the DOM, but
   * that's outside the scope of this tutorial. For now, we just need
   * a way to refresh our `<ul>` song list DOM node with the latest
   * correct data.
   */
  while (elements.songList.firstChild) {
    elements.songList.removeChild(elements.songList.firstChild);
  }
  songs.forEach(song => {
    const li = document.createElement("li");
    const isActiveSong =
      isPlaying && activeSong && activeSong.title === song.title;
    li.innerHTML = `
      <div class="song-item ${isActiveSong ? "active" : ""}">
        <div class="song-controls">
          <i class="fa ${isActiveSong ? "fa-pause" : "fa-play"}"></i>
        </div>
        <div class="song-content">
          <span>${song.title}</span>
          <span class="song-content-artist">${song.artist}</span>
        </div>
      </div>
    `;
    li.addEventListener("click", () => {
      if (isActiveSong) {
        actions.togglePlay();
        return;
      }
      actions.playSong(song);
    });
    fragment.appendChild(li);
  });
  elements.songList.appendChild(fragment);
};

/**
 * Create our application Store -- the single source of truth
 * for app state.
 */
const store = createStore(songReducer);

/**
 * Bind our Action Creators to our `dispatch` function so we
 * don't have to call `store.dispatch()` each time.
 */
const boundedActions = bindActionCreators(songActions, store.dispatch);

/**
 * Create a listener for the player's state and handle the UI
 * updates.
 */
store.subscribe(() => {
  const { activeSong, isPlaying } = store.getState();
  if (activeSong) {
    elements.player.activeSong.innerHTML = `${activeSong.title} - ${
      activeSong.artist
    }`;
  }
  if (isPlaying) {
    elements.player.playPauseIcon.classList.add("fa-pause");
  } else {
    elements.player.playPauseIcon.classList.remove("fa-pause");
  }
});

/**
 * Create a listener for the full list of songs available so that we
 * can keep the list up to date.
 */
store.subscribe(() => {
  const { songs, activeSong, isPlaying } = store.getState();
  renderSongList(songs, activeSong, isPlaying, boundedActions);
});

/**
 * Bind Action dispatchers to the player's control elements.
 */
elements.player.nextIcon.addEventListener("click", () => {
  boundedActions.playNext();
});
elements.player.prevIcon.addEventListener("click", () => {
  boundedActions.playPrev();
});
elements.player.playPauseIcon.addEventListener("click", () =>
  boundedActions.togglePlay()
);

/**
 * Initialize our Store's state by loading all our songs.
 */
boundedActions.loadSongs(songs);
