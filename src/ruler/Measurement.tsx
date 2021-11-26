import { useRecoilValue } from 'recoil';
import { Point, Ruler } from '../api/types';
import { visibleRulerState } from '../app/rulerState';
import { Layer, Positioned } from '../map/Layer';
import { PlacedToken } from '../map/PlacedToken';
import { ArcCircle } from './ArcCircle';
import { LengthsDisplay } from './LengthsDisplay';

export const Measurement = ({ id }: MeasurementProps) => {
  const ruler = useRecoilValue(visibleRulerState(id));

  if (ruler.origin === null) return null;

  const { isSingle, origin, path, lastPoint, lastLength, totalLength, scaledX, scaledY } = calcMetrics(ruler);

  return (
    <>
      <Layer>
        <svg strokeLinejoin="round" strokeLinecap="round" height="100%" width="100%">
          <defs>
            <marker id="arrowhead" markerUnits="strokeWidth" markerWidth="5" markerHeight="2.5" refX="5" refY="1.25" orient="auto">
              <polygon points="0 0, 5 1.25, 0 2.5" />
            </marker>
          </defs>
          <path d={path} className="back-stroke" markerEnd="url(#arrowhead)" />
          <path d={path} className="fore-stroke" markerEnd="url(#arrowhead)" />
          {isSingle && <ArcCircle origin={origin} target={lastPoint} />}
        </svg>
      </Layer>
      <Positioned style={{ transform: `translate(${lastPoint.x}px, ${lastPoint.y}px)` }}>
        <Positioned style={{ transform: `translate(${toPercent(scaledX * 1.25)}, ${toPercent(scaledY * 1.25)})` }}>
          <LengthsDisplay lastLength={lastLength} totalLength={totalLength} />
        </Positioned>
        {ruler.attached && (
          <div style={{ position: 'absolute' }}>
            <PlacedToken id={ruler.attached} />
          </div>
        )}
      </Positioned>
    </>
  );
};

type MeasurementProps = { id: string };

type Vector = { start: Point; end: Point; hypot: number; scaledX: number; scaledY: number };

type PathData = {
  vectors: Vector[];
  lastPoint: Point;
  lastLength: number;
  totalLength: number;
  lastAngle: number;
  scaledX: number;
  scaledY: number;
};

type RulerData = {
  path: string;
  origin: Point;
  isSingle: boolean;
  lastPoint: Point;
  lastLength: number;
  totalLength: number;
  scaledX: number;
  scaledY: number;
};

export function calcMetrics({ origin, points }: Ruler): RulerData {
  if (!origin) throw Error(`Parameter 'origin' is required.`);

  const path = `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`;

  const { vectors, lastPoint, lastLength, totalLength, scaledX, scaledY } = points.reduce(
    ({ vectors, lastPoint: start, totalLength }: PathData, end: Point) => {
      const width = end.x - start.x;
      const height = end.y - start.y;
      const hypot = Math.hypot(width, height);
      const scaledX = width / hypot;
      const scaledY = height / hypot;
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

  return {
    path,
    origin,
    isSingle,
    lastPoint,
    lastLength: lastLength / 48.0,
    totalLength: totalLength / 48.0,
    scaledX,
    scaledY,
  };
}

const toPercent = (number: number) => (number * 100).toFixed(4) + '%';
