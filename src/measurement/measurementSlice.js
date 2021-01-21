import { createSelector, createSlice } from '@reduxjs/toolkit';

const measurementSlice = createSlice({
  name: 'measurement',
  initialState: { points: [], origin: null, isPublic: true },
  reducers: {
    pathStarted: (state, action) => {
      state.origin = action.payload;
      state.points = [action.payload];
    },
    pathStopped: (state) => {
      state.origin = null;
      state.points = [];
    },
    movedTo: (state, action) => {
      if (state.points.length === 0) return;

      state.points[state.points.length - 1] = action.payload;
    },
    pointPushed: (state) => {
      if (state.points.length === 0) return;

      state.points.push(...state.points.slice(-1));
    },
    pointPopped: (state) => {
      if (state.points.length === 0) return;

      state.points.pop();
    },
  },
});

export const { pathStarted, pathStopped, movedTo, pointPushed, pointPopped } = measurementSlice.actions;

export default measurementSlice.reducer;

export const selectPoints = (state) => state.measurements.origin && [state.measurements.origin, ...state.measurements.points];

export const selectPathAsString = (state) =>
  state.measurements.origin &&
  `M ${state.measurements.origin.x},${state.measurements.origin.y} ${state.measurements.points.map(({ x, y }) => `${x},${y}`).join(' ')}`;

export const selectPathAsVectors = createSelector(
  [(state) => state.measurements],
  (measurements) =>
    measurements.points.reduce(({ vectors, start }, end) => ({ vectors: [...vectors, { start, end }], start: end }), {
      vectors: [],
      start: measurements.origin,
    }).vectors
);
