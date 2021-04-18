import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'selection',
  initialState: {
    selected: null,
    focused: null,
  },
  reducers: {
    tokenSelected: (state, action) => {
      state.selected = action.payload;
    },
    tokenDeselected: (state, action) => {
      state.selected = null;
    },
    tokenEntered: (state, action) => {
      state.focused = action.payload;
    },
    tokenLeft: (state, action) => {
      state.focused = null;
    },
  },
});

export const { tokenSelected, tokenDeselected, tokenEntered, tokenLeft } = slice.actions;

export default slice.reducer;

export const selectFocusedTokenId = state => state.selection.focused;
export const selectSelectedTokenId = state => state.selection.selected;