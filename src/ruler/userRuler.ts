import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Point } from '../app/math';
import { Ruler, selfRulerState } from '../map/State';

export function useRuler(): [Ruler, RulerCommands] {
  const [ruler, setRuler] = useRecoilState(selfRulerState);

  const start = useCallback((at: Point, origin?: Point) => setRuler(rulerReducer(ruler, startAction(at, origin))), [ruler, setRuler]);
  const stop = useCallback(() => setRuler(rulerReducer(ruler, stopAction())), [ruler, setRuler]);
  const moveTo = useCallback((to: Point) => setRuler(rulerReducer(ruler, moveToAction(to))), [ruler, setRuler]);
  const pushWaypoint = useCallback(() => setRuler(rulerReducer(ruler, pushWaypointAction())), [ruler, setRuler]);
  const popWaypoint = useCallback(() => setRuler(rulerReducer(ruler, popWaypointAction())), [ruler, setRuler]);

  return [ruler, { start, stop, moveTo, pushWaypoint, popWaypoint }];
}

type RulerStartAction = { type: 'pathStarted'; payload: { at: Point; origin?: Point } };
type RulerStopAction = { type: 'pathStopped' };
type RulerMoveToAction = { type: 'movedTo'; payload: Point };
type RulerPushWaypointAction = { type: 'pointPushed' };
type RulerPopWaypointAction = { type: 'pointPopped' };

type RulerCommands = {
  start: (at: Point, origin?: Point) => void;
  stop: () => void;
  moveTo: (to: Point) => void;
  pushWaypoint: () => void;
  popWaypoint: () => void;
}

type RulerAction = RulerStartAction | RulerStopAction | RulerMoveToAction | RulerPushWaypointAction | RulerPopWaypointAction;

function startAction(at: Point, origin?: Point): RulerStartAction {
  return { type: 'pathStarted', payload: { at, origin } };
}

function stopAction(): RulerStopAction {
  return { type: 'pathStopped' };
}

function moveToAction(to: Point): RulerMoveToAction {
  return { type: 'movedTo', payload: to };
}

function pushWaypointAction(): RulerPushWaypointAction {
  return { type: 'pointPushed' };
}

function popWaypointAction(): RulerPopWaypointAction {
  return { type: 'pointPopped' };
}

function rulerReducer(state: Ruler, action: RulerAction): Ruler {
  switch (action.type) {
    case 'pathStarted': {
      const { at, origin = at } = action.payload;

      return { ...state, origin: origin || at, points: [at] };
    }
    case 'pathStopped': {
      return { ...state, origin: null, points: [] };
    }
    case 'movedTo': {
      if (state.origin === null) return state;

      const lastPoint = state.points[state.points.length - 1];

      if (lastPoint.x === action.payload.x && lastPoint.y === action.payload.y) return state;

      return { ...state, points: [...state.points.slice(0, -1), action.payload] };
    }
    case 'pointPushed': {
      if (state.origin === null) return state;

      return { ...state, points: [...state.points, ...state.points.slice(-1)] };
    }
    case 'pointPopped': {
      if (state.origin === null || state.points.length === 1) return state;

      return { ...state, points: [...state.points.slice(0, -1)] };
    }
    default:
      return state;
  }
}
