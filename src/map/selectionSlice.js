import { createSlice } from '@reduxjs/toolkit';
import { originSuggested } from '../ruler/rulerSlice';
import { selectTokenById } from './tokenSlice';

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

export const tokenHovered = (id) => (dispatch, getState, invoke) => {
  const { position } = selectTokenById(getState(), id);

  dispatch(tokenEntered(id));
  dispatch(originSuggested(position));
};

export const tokenBlurred = (id) => (dispatch, getState, invoke) => {
  dispatch(tokenLeft(id));
  dispatch(originSuggested(null));
};
