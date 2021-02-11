import { createEntityAdapter, createSelector, createSlice, nanoid } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';
import { mapLoaded, selectMapId } from '../map/mapSlice';

const adapter = createEntityAdapter();

const self = nanoid();

const initialState = adapter.getInitialState({ self });

const slice = createSlice({
  name: 'ruler',
  initialState,
  reducers: {
    pathStarted: (state, action) => {
      const self = state.entities[state.self];

      self.origin = action.payload;
      self.points = [action.payload];
    },
    pathStopped: (state) => {
      const self = state.entities[state.self];

      self.origin = null;
      self.points = [];
    },
    movedTo: (state, action) => {
      const self = state.entities[state.self];

      if (self.origin === null) return;

      self.points[self.points.length - 1] = action.payload;
    },
    pointPushed: (state) => {
      const self = state.entities[state.self];

      if (self.origin === null) return;

      self.points.push(...self.points.slice(-1));
    },
    pointPopped: (state) => {
      const self = state.entities[state.self];

      if (self.origin === null || self.points.length === 1) return;

      self.points.pop();
    },
    updateRemoteRuler: (state, action) => {
      const { id, origin, points } = action.payload;

      if (id === state.self) return; // We don't update our own ruler via this call.

      adapter.upsertOne(state, { id, origin, points });
    },
  },
  extraReducers: {
    [mapLoaded]: (state) => {
      adapter.setAll(state, [{ id: self, origin: null, points: [] }]);
    },
  },
});

export const { pathStarted, pathStopped, movedTo, pointPushed, pointPopped, updateRemoteRuler } = slice.actions;

export default slice.reducer;

export const { selectAll: selectAllRulers } = adapter.getSelectors((state) => state.ruler);

const requestUpdateRemoteRulerThrottled = throttle((dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());
  const selfRuler = selectSelf(getState());

  invoke('updateRuler', mapId, selfRuler);
}, 100);

export const requestUpdateRemoteRuler = () => requestUpdateRemoteRulerThrottled;

export const selectSelf = createSelector(
  (state) => state.ruler.entities[state.ruler.self],
  (self) => self
);

export const selectShowRuler = createSelector(selectSelf, (self) => !!self.origin);

function getRuler(origin, points) {
  if (origin === null) return null;

  const path = `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`;

  const { vectors, lastPoint, lastLength, totalLength, scaledX, scaledY } = points.reduce(
    ({ vectors, lastPoint: start, totalLength }, end) => {
      const width = end.x - start.x;
      const height = end.y - start.y;
      const hypot = Math.hypot(width, height);
      const scaledX = (width / hypot).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 4 });
      const scaledY = (height / hypot).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 4 });

      return {
        vectors: [...vectors, { start, end, hypot, scaledX, scaledY }],
        lastPoint: end, // Ending of prior vector becomes start of next one.
        lastLength: hypot,
        totalLength: totalLength + hypot,
        scaledX,
        scaledY,
      };
    },
    {
      vectors: [],
      lastPoint: origin,
      totalLength: 0.0,
    }
  );

  const isSingle = vectors.length === 1;

  const [{ hypot: radius }] = vectors;

  return { path, origin, radius, isSingle, lastPoint, lastLength: lastLength / 48.0, totalLength: totalLength / 48.0, scaledX, scaledY };
}

export const selectRulerMetrics = createSelector(selectAllRulers, (rulers) => {
  return rulers.filter(({ origin }) => !!origin).map(({ id, origin, points }) => ({ id, ...getRuler(origin, points) }));
});
