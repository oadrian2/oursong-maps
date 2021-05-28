import { createEntityAdapter, createSelector, createSlice, nanoid } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';
import { Point } from '../app/math';
import { RootState } from '../app/store';
import { mapLoaded, selectMapId } from '../map/mapSlice';
import { moveTokenToRequested } from '../map/tokenSlice';

interface Ruler {
  id: string;
  origin: Point | null;
  points: Point[];
}

const adapter = createEntityAdapter<Ruler>();

const self = nanoid();

const initialState = adapter.getInitialState({ self, suggestedOrigin: null });

const slice = createSlice({
  name: 'ruler',
  initialState,
  reducers: {
    pathStarted: (state, action) => {
      const self = state.entities[state.self]!;

      self.origin = state.suggestedOrigin || action.payload;
      self.points = [action.payload];
    },
    pathStopped: (state) => {
      const self = state.entities[state.self]!;

      self.origin = null;
      self.points = [];
    },
    movedTo: (state, action) => {
      const self = state.entities[state.self]!;

      if (self.origin === null) return;

      const lastPoint = self.points[self.points.length - 1];

      if (lastPoint.x === action.payload.x && lastPoint.y === action.payload.y) return;

      self.points[self.points.length - 1] = action.payload;
    },
    pointPushed: (state) => {
      const self = state.entities[state.self]!;

      if (self.origin === null) return;

      self.points.push(...self.points.slice(-1));
    },
    pointPopped: (state) => {
      const self = state.entities[state.self]!;

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
  extraReducers: (builder) => {
    builder.addCase(mapLoaded.type, (state) => {
      adapter.setAll(state, [{ id: self, origin: null, points: [] }]);
    });
  },
});

export const { pathStarted, pathStopped, movedTo, pointPushed, pointPopped, originSuggested, updateRemoteRuler } = slice.actions;

export default slice.reducer;

export const { selectAll: selectAllRulers } = adapter.getSelectors((state: RootState) => state.ruler);

const requestUpdateRemoteRulerThrottled = throttle((dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());
  const selfRuler = selectOwnRuler(getState());

  invoke('updateRuler', mapId, selfRuler, new Date());
}, 200);

export const requestUpdateRemoteRuler = () => requestUpdateRemoteRulerThrottled;

export const selectOwnRuler = createSelector(
  (state: RootState) => state.ruler.entities[state.ruler.self],
  (self) => self!
);

export const selectOwnRulerPath = createSelector(
  selectOwnRuler,
  ({ origin, points }: Ruler) => origin && `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`
);

export const selectShowRuler = createSelector(selectOwnRuler, (self) => !!self.origin);

type Vector = { start: Point; end: Point; hypot: number; scaledX: string; scaledY: string };

type PathData = {
  vectors: Vector[];
  lastPoint: Point;
  lastLength: number;
  totalLength: number;
  lastAngle: number;
  scaledX: string;
  scaledY: string;
};

export type RulerData = {
  id?: string;
  path: string;
  origin: Point;
  radius: number;
  isSingle: boolean;
  lastPoint: Point;
  lastAngle: number;
  lastLength: number;
  totalLength: number;
  scaledX: string,
  scaledY: string,
}

function getRuler({ id, origin, points }: Ruler): RulerData {
  if (!origin) throw Error(`Parameter 'origin' is required.`);

  const path = `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`;

  const { vectors, lastPoint, lastLength, lastAngle, totalLength, scaledX, scaledY } = points.reduce(
    ({ vectors, lastPoint: start, totalLength }: PathData, end: Point) => {
      const width = end.x - start.x;
      const height = end.y - start.y;
      const hypot = Math.hypot(width, height);
      const scaledX = toPercent(width / hypot);
      const scaledY = toPercent(height / hypot);
      const angle = Math.atan2(width, height);

      return {
        vectors: [...vectors, { start, end, hypot, scaledX, scaledY }],
        lastPoint: end, // Ending of prior vector becomes start of next one.
        lastLength: hypot,
        lastAngle: angle,
        totalLength: totalLength + hypot,
        scaledX,
        scaledY,
      };
    },
    {
      vectors: [],
      lastPoint: origin,
      totalLength: 0.0,
    } as unknown as PathData
  ) as PathData;

  const isSingle = vectors.length === 1;

  const [{ hypot: radius }] = vectors;

  return {
    id,
    path,
    origin,
    radius,
    isSingle,
    lastPoint,
    lastAngle,
    lastLength: lastLength / 48.0,
    totalLength: totalLength / 48.0,
    scaledX,
    scaledY,
  };
}

export const selectRulerMetrics = createSelector(selectAllRulers, (rulers) => {
  return rulers.filter(({ origin }: Ruler) => origin !== null).map(getRuler);
});

export const pathCompleted = () => (dispatch: any, getState: () => RootState) => {
  const state = getState();

  const moving = state.selection.selected;

  if (moving) {
    const self: Ruler = selectOwnRuler(state);
    const path: Point[] = [self.origin!, ...self.points];
    const { x: startX, y: startY } = path[path.length - 2];
    const { x: endX, y: endY } = path[path.length - 1];

    dispatch(moveTokenToRequested({ id: moving, position: { x: endX, y: endY }, facing: Math.atan2(endY - startY, endX - startX), path }));
  }
};

const toPercent = (number: number) => (number * 100).toFixed(4) + '%';
