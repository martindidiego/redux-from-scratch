const loadSongs = songs => ({ type: "LOAD_SONGS", songs });
const playSong = song => ({ type: "PLAY_SONG", song });
const togglePlay = () => ({ type: "TOGGLE_PLAY" });
const playNext = () => ({ type: "PLAY_NEXT" });
const playPrev = () => ({ type: "PLAY_PREV" });

export default { loadSongs, playSong, togglePlay, playNext, playPrev };
