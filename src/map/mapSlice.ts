import { createSelector, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, Invoke, RootState } from '../app/store';

interface Map {
  id?: string;
  game?: string;
  map?: { image: string; width: number; scale: number };
  title?: string;
  image?: string;
  gameDate?: Date;
  connected: boolean;
  loaded: boolean;
}

const slice = createSlice({
  name: 'map',
  initialState: {
    connected: false,
    loaded: false,
  } as Map,
  reducers: {
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
  },
});

export const { mapLoaded, connecting, connected } = slice.actions;

export default slice.reducer;

export const selectMap = (state: RootState) => state.map;

export const selectMapId = createSelector(selectMap, ({ game, id }) => ({ game, id }));

export const selectConnected = createSelector(selectMap, ({ connected }) => connected);

export const selectLoaded = createSelector(selectMap, ({ loaded }) => loaded);

export const selectMapTitle = createSelector(selectMap, ({ title }) => title);

export const selectMapImage = createSelector(selectMap, ({ game, id, map }) => {
  if (!game || !id || !map) throw Error('Map not loaded');

  const { image, width, scale } = map;

  return {
    src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
    width: width * scale,
  };
});

export const joinMapRequested = (game: string, id: string) => (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
  invoke('joinMap', game, id);
};

export const leaveMapRequested = (game: string, id: string) => (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
  invoke('leaveMap', game, id);
};
