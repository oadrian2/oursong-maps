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

export const selectPathAsString = createSelector(
  [(state) => state.measurements.origin, (state) => state.measurements.points],
  (origin, points) => origin && `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`
);

export const selectPathAsVectors = createSelector(
  [(state) => state.measurements],
  (measurements) =>
    measurements.points.reduce(
      ({ vectors, start }, end) => ({
        vectors: [...vectors, { start, end, length: Math.hypot(end.y - start.y, end.x - start.x) }],
        start: end,
      }),
      {
        vectors: [],
        start: measurements.origin,
      }
    ).vectors
);

export const selectMeasurement = createSelector([selectPathAsVectors, selectPathAsString], (vectors, path) => {
  if (!path) return null;

  const isSingle = vectors.length === 1;

  const [{ start: origin, length: radius }] = vectors;

  const { lastLength, totalLength } = vectors.reduce(
    (result, { length }) => ({
      lastLength: length,
      totalLength: length + result.totalLength,
    }),
    { lastLength: 0.0, totalLength: 0.0 }
  );

  return { path, origin, radius, isSingle, lastLength: lastLength / 48.0, totalLength: totalLength / 48.0 };
});
