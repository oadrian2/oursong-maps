import { createEntityAdapter, createSelector, createSlice, nanoid } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';
import { mapLoaded, selectMapId } from '../map/mapSlice';
import { moveTokenToRequested } from '../map/tokenSlice';

const adapter = createEntityAdapter();

const self = nanoid();

const initialState = adapter.getInitialState({ self, suggestedOrigin: null });

const slice = createSlice({
  name: 'ruler',
  initialState,
  reducers: {
    pathStarted: (state, action) => {
      const self = state.entities[state.self];

      self.origin = state.suggestedOrigin || action.payload;
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

      const lastPoint = self.points[self.points.length - 1];

      if (lastPoint.x === action.payload.x && lastPoint.y === action.payload.y) return;

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
    originSuggested: (state, action) => {
      state.suggestedOrigin = action.payload;
    },
  },
  extraReducers: {
    [mapLoaded]: (state) => {
      adapter.setAll(state, [{ id: self, origin: null, points: [] }]);
    },
  },
});

export const { pathStarted, pathStopped, movedTo, pointPushed, pointPopped, originSuggested, updateRemoteRuler } = slice.actions;

export default slice.reducer;

export const { selectAll: selectAllRulers } = adapter.getSelectors((state) => state.ruler);

const requestUpdateRemoteRulerThrottled = throttle((dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());
  const selfRuler = selectOwnRuler(getState());

  invoke('updateRuler', mapId, selfRuler);
}, 100);

export const requestUpdateRemoteRuler = () => requestUpdateRemoteRulerThrottled;

export const selectOwnRuler = createSelector(
  (state) => state.ruler.entities[state.ruler.self],
  (self) => self
);

export const selectOwnRulerPath = createSelector(
  selectOwnRuler,
  ({ origin, points }) => origin && `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`
);

export const selectShowRuler = createSelector(selectOwnRuler, (self) => !!self.origin);

function getRuler(origin, points) {
  if (origin === null) return null;

  const path = `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`;

  const { vectors, lastPoint, lastLength, totalLength, scaledX, scaledY } = points.reduce(
    ({ vectors, lastPoint: start, totalLength }, end) => {
      const width = end.x - start.x;
      const height = end.y - start.y;
      const hypot = Math.hypot(width, height);
      const scaledX = toPercent(width / hypot);
      const scaledY = toPercent(height / hypot);

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

export const pathCompleted = () => (dispatch, getState) => {
  const state = getState();

  const moving = state.tokens.moving;

  if (moving) {
    const self = selectOwnRuler(state);
    const path = [self.origin, ...self.points];

    dispatch(moveTokenToRequested({ id: moving, position: path[path.length - 1], path }));
  }
};

const toPercent = (number) => (number * 100).toFixed(4) + '%';
