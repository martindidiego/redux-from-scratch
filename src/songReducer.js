/**
 * Our app's initial state.
 */
const initialState = {
  isPlaying: false,
  activeSong: null,
  songs: []
};

/**
 * Reducer for our 'Song' slice of state.
 */
const songReducer = (state = initialState, action) => {
  const actionMap = {
    LOAD_SONGS: () => ({
      ...state,
      songs: action.songs
    }),
    PLAY_SONG: () => ({
      ...state,
      isPlaying: true,
      activeSong: action.song
    }),
    TOGGLE_PLAY: () => ({
      ...state,
      isPlaying: !state.isPlaying
    }),
    PLAY_NEXT: () => {
      if (!state.activeSong) {
        return {
          ...state,
          isPlaying: true,
          activeSong: state.songs[0]
        };
      }
      const activeSongIndex = state.songs.indexOf(state.activeSong);
      const nextSong = state.songs[(activeSongIndex + 1) % state.songs.length];
      return {
        ...state,
        isPlaying: true,
        activeSong: nextSong
      };
    },
    PLAY_PREV: () => {
      if (!state.activeSong) {
        return {
          ...state,
          isPlaying: true,
          activeSong: state.songs[0]
        };
      }
      const activeSongIndex = state.songs.indexOf(state.activeSong);
      const prevSong = state.songs[(activeSongIndex - 1) % state.songs.length];
      return {
        ...state,
        isPlaying: true,
        activeSong: prevSong
      };
    }
  };

  return actionMap[action.type]() || state;
};

export default songReducer;
