import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Point } from '../app/math';
import { RootState } from '../app/store';
import { mapLoaded } from '../map/mapSlice';
import { moveTokenToRequested } from '../map/tokenSlice';

interface Ruler {
  id: string;
  origin: Point | null;
  points: Point[];
}

const adapter = createEntityAdapter<Ruler>();

const initialState = adapter.getInitialState({ self: 'should not see', suggestedOrigin: null });

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
    originSuggested: (state, action) => {
      state.suggestedOrigin = action.payload;
    },
    setSelf: (state, action) => {
      state.self = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(mapLoaded.type, (state) => {
      adapter.setAll(state, [{ id: state.self, origin: null, points: [] }]);
    });
  },
});

export const { pathStarted, pathStopped, movedTo, pointPushed, pointPopped, originSuggested, setSelf } = slice.actions;

export default slice.reducer;

export const pathCompleted = (moving: string | null) => (dispatch: any, getState: () => RootState) => {
  const state = getState();

  if (moving) {
    const self: Ruler = state.ruler.entities[state.ruler.self]!;
    const path: Point[] = [self.origin!, ...self.points];
    const { x: startX, y: startY } = path[path.length - 2];
    const { x: endX, y: endY } = path[path.length - 1];

    dispatch(moveTokenToRequested({ id: moving, position: { x: endX, y: endY }, facing: Math.atan2(endY - startY, endX - startX), path }));
  }
};
