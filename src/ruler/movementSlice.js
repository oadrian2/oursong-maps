import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

export const MeasurementStrategy = {
  centerToCenter: 'center-to-center',
  edgeToEdge: 'edge-to-edge',
  centerToCenterNormalized: 'center-to-center-normalized'
}

const initialState = adapter.getInitialState({
  measurementStyle: MeasurementStrategy.centerToCenter
});

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
