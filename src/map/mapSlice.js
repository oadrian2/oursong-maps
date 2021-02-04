import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {
    game: 'ttb',
    connected: false,
    loaded: false,
  },
  reducers: {
    showGrid: (state) => {
      state.showGrid = true;
    },
    hideGrid: (state) => {
      state.showGrid = false;
    },
    mapLoaded: (state, action) => {
      const { id, title, image, map, gameDate } = action.payload;

      state.id = id;
      state.title = title;
      state.image = image;
      state.map = map;
      state.gameDate = gameDate;
      state.loaded = true;
    },
    connecting: (state) => {
      state.connected = false;
    },
    connected: (state) => {
      state.connected = true;
    },
  }
});

export const { mapLoaded, connecting, connected } = slice.actions;

export default slice.reducer;

export const selectMap = (state) => state.map;

export const selectEncounter = createSelector(selectMap, (map) => map.id);

export const selectConnected = createSelector(selectMap, ({ connected }) => connected);

export const selectLoaded = createSelector(selectMap, ({ loaded }) => loaded);

export const selectMapImage = createSelector(selectMap, ({ game, id, map: { image, width, scale } }) => ({
  src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
  width: width * scale,
}));

export const joinMapRequested = (id) => (dispatch, getState, invoke) => {
  invoke('joinMap', id);
};

export const leaveMapRequested = (id) => (dispatch, getState, invoke) => {
  invoke('leaveMap', id);
};
