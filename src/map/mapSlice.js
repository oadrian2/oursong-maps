import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {
    image: 'map.png',
    scale: 2.5,
    showGrid: false,
    tokens: [],
  },
  reducers: {
    placeToken: (state, action) => {
      const { id, token, position, moveable } = action.playload;

      state.tokens[id] = { token, position, moveable };
    },
    trashToken: (state, action) => {
      const { id } = action.playload;

      delete state.tokens[id];
    },
    moveToken: (state, action) => {
      const { id, position, moveable } = action.playload;

      if (!moveable) return;

      state.tokens[id].position = position;
    },
    stashToken: (state, action) => {
      const { id, stashable } = action.playload;

      if (!stashable) return;

      state.tokens[id].position = null;
    },
    unstashToken: (state, action) => {
      const { id, position } = action.playload;

      state.tokens[id] = position;
    },
    showGrid: (state) => {
      state.showGrid = true;
    },
    hideGrid: (state) => {
      state.showGrid = false;
    },
  },
});

export const { placeToken, trashToken, moveToken, stashToken, unstashToken } = slice.actions;

export default slice.reducer;
