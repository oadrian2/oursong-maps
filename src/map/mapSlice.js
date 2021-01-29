import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {
    id: '',
    game: 'ttb',
    connected: false,
    encounter: 123,
    title: '',
    gameDate: '',
    image: '',
    scale: 2.2,
    showGrid: false,
    loaded: false,
  },
  reducers: {
    showGrid: (state) => {
      state.showGrid = true;
    },
    hideGrid: (state) => {
      state.showGrid = false;
    },
    mapUpdated: (state, action) => {
      const { id, title, image, gameDate } = action.payload;

      state.id = id;
      state.title = title;
      state.image = image;
      state.gameDate = gameDate;
    },
    connecting: (state) => {
      state.connected = false;
    },
    connected: (state) => {
      state.connected = true;
    },
    loaded: (state) => {
      state.loaded = true;
    },
  },
});

export const { mapUpdated, connecting, connected, loaded } = slice.actions;

export default slice.reducer;

export const selectMap = (state) => state.map;

export const selectEncounter = createSelector(selectMap, (map) => map.id);

export const selectLoaded = createSelector(selectMap, (map) => map.loaded);

export const selectConnected = createSelector(selectMap, ({ connected }) => connected);

export const selectMapImage = createSelector(selectMap, ({ game, id, image, scale }) => ({
  src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
  scale,
}));

export const joinMapRequested = (id) => (dispatch, getState, invoke) => {
  invoke('joinMap', id);
};

export const leaveMapRequested = (id) => (dispatch, getState, invoke) => {
  invoke('leaveMap', id);
};
