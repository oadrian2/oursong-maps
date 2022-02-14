import { useCallback } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import { Point, Ruler, TokenID } from '../api/types';
import { selfRulerState } from '../app/rulerState';
import { tokenState } from '../app/tokenState';

export function useRuler(): [Ruler, RulerCommands] {
  const [ruler, setRuler] = useRecoilState(selfRulerState);

  const start = useCallback(
    (at: Point, origin: Point | null, attached: TokenID | null) => setRuler({ ...ruler, origin: origin ?? at, points: [at], attached }),
    [ruler, setRuler]
  );

  const stop = useCallback(() => setRuler({ ...ruler, origin: null, points: [], attached: null }), [ruler, setRuler]);

  const moveTo = useCallback(
    (to: Point) => {
      if (ruler.origin === null) return;

      const lastPoint = ruler.points[ruler.points.length - 1];

      if (lastPoint.x === to.x && lastPoint.y === to.y) return;

      setRuler({ ...ruler, points: [...ruler.points.slice(0, -1), to] });
    },
    [ruler, setRuler]
  );

  const pushWaypoint = useCallback(() => {
    if (ruler.origin === null) return;

    setRuler({ ...ruler, points: [...ruler.points, ...ruler.points.slice(-1)] });
  }, [ruler, setRuler]);

  const popWaypoint = useCallback(() => {
    if (ruler.origin === null || ruler.points.length === 1) return;

    setRuler({ ...ruler, points: [...ruler.points.slice(0, -1)] });
  }, [ruler, setRuler]);

  const complete = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const ruler = await snapshot.getPromise(selfRulerState);

        if (ruler.attached) {
          const token = await snapshot.getPromise(tokenState(ruler.attached));

          const path: Point[] = [ruler.origin!, ...ruler.points];
          const { x: startX, y: startY } = path[path.length - 2];
          const { x: endX, y: endY } = path[path.length - 1];

          const position = { x: endX, y: endY };
          const facing = Math.atan2(endY - startY, endX - startX);

          set(tokenState(ruler.attached), { ...token, position, facing, path });
        }

        set(selfRulerState, { ...ruler, origin: null, points: [], attached: null });
      },
    []
  );

  ///

  return [ruler, { start, stop, complete, moveTo, pushWaypoint, popWaypoint }];
}

type RulerCommands = {
  start: (at: Point, origin: Point | null, attached: TokenID | null) => void;
  stop: () => void;
  complete: () => void;
  moveTo: (to: Point) => void;
  pushWaypoint: () => void;
  popWaypoint: () => void;
};
