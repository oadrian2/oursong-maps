import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

const initialState = adapter.getInitialState();

const slice = createSlice({
  name: 'moves',
  initialState,
  reducers: {
    tokenMoved: adapter.upsertOne,
    tokenMoveUndone: () => null,
  },
});

export const { tokenMoved, tokenMoveUndone } = slice.actions;

export default slice.reducer;
