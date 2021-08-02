import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface Map {
  id?: string;
  game?: string;
  connected: boolean;
  loaded: boolean;
  connectionId?: string;
}

const slice = createSlice({
  name: 'map',
  initialState: {
    connected: false,
    loaded: false,
  } as Map,
  reducers: {
    mapLoaded: (state, action) => {
      const { id, game } = action.payload;

      state.id = id;
      state.game = game;
      state.loaded = true;
    },
    connecting: (state) => {
      state.connected = false;
    },
    connected: (state, action) => {
      state.connected = true;
      state.connectionId = action.payload;
    },
  },
});

export const { mapLoaded, connecting, connected } = slice.actions;

export default slice.reducer;

export const selectMap = (state: RootState) => state.map;

export const selectMapId = createSelector(selectMap, ({ game, id }) => ({ game, id }));

export const selectConnected = createSelector(selectMap, ({ connected }) => connected);

export const selectLoaded = createSelector(selectMap, ({ loaded }) => loaded);
