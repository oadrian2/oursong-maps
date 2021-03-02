import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {
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
      const { id, game, title, image, map, gameDate } = action.payload;

      state.id = id;
      state.game = game;
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

export const selectMapId = createSelector(selectMap, ({ game, id }) => ({ game, id }));

export const selectConnected = createSelector(selectMap, ({ connected }) => connected);

export const selectLoaded = createSelector(selectMap, ({ loaded }) => loaded);

export const selectMapTitle = createSelector(selectMap, ({ title }) => title);

export const selectMapImage = createSelector(selectMap, ({ game, id, map: { image, width, scale } }) => ({
  src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
  width: width * scale,
}));

export const joinMapRequested = (game, id) => (dispatch, getState, invoke) => {
  invoke('joinMap', game, id);
};

export const leaveMapRequested = (game, id) => (dispatch, getState, invoke) => {
  invoke('leaveMap', game, id);
};
