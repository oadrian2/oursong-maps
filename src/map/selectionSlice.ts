import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch, Invoke, RootState } from '../app/store';
import { originSuggested } from '../ruler/rulerSlice';
import { selectTokenById } from './tokenSlice';

interface Selection {
  selected: string | null;
  focused: string | null;
}

const initialState: Selection = {
  selected: null,
  focused: null,
};

const slice = createSlice({
  name: 'selection',
  initialState,
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

export const selectFocusedTokenId = (state: RootState) => state.selection.focused;
export const selectSelectedTokenId = (state: RootState) => state.selection.selected;

export const tokenHovered = (id: string) => (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
  const token = selectTokenById(getState(), id);

  if (!token) throw Error('Token not found');

  const { position } = token;

  dispatch(tokenEntered(id));
  dispatch(originSuggested(position));
};

export const tokenBlurred = (id: string) => (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
  dispatch(tokenLeft(id));
  dispatch(originSuggested(null));
};
