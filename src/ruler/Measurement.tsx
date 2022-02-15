import Box from '@mui/system/Box';
import { useRecoilValue } from 'recoil';
import { Point, Ruler } from '../api/types';
import { arcDegreesState } from '../app/campaignState';
import { mapImageState } from '../app/mapState';
import { visibleRulerState } from '../app/rulerState';
import { Layer, Stack } from '../map/Layer';
import { PlacedToken } from '../map/PlacedToken';
import { ArcCircle } from './ArcCircle';
import { LengthsDisplay, OverlayCircle, OverlayRectangle } from './LengthsDisplay';

const CIRCLE_SIZE = 16 * 8.5;
const TOLERANCE = 32;
const CELL_SIZE = 48.0;

export const Measurement = ({ id }: MeasurementProps) => {
  const ruler = useRecoilValue(visibleRulerState(id));
  const { width, height } = useRecoilValue(mapImageState);
  const arcDegrees = useRecoilValue(arcDegreesState);

  if (ruler.origin === null) return null;

  const { isSingle, origin, path, lastPoint, lastLength, totalLength, scaledX: offsetX, scaledY: offsetY } = calcMetrics(ruler);

  const overlayInBounds = inBounds(
    { x: lastPoint.x + offsetX * CIRCLE_SIZE, y: lastPoint.y + offsetY * CIRCLE_SIZE },
    { left: 0 - TOLERANCE, top: 0 - TOLERANCE, right: width + TOLERANCE, bottom: height + TOLERANCE }
  );

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
          {isSingle && <ArcCircle origin={origin} target={lastPoint} arcDegrees={arcDegrees} />}
        </svg>
      </Layer>
      <Layer>
        <Stack style={{ transform: `translate(${lastPoint.x}px, ${lastPoint.y}px)` }}>
          {overlayInBounds && (
            <OverlayCircle style={{ transform: `translate(${toPercent(offsetX)}, ${toPercent(offsetY)})` }}>
              <LengthsDisplay lastLength={lastLength} totalLength={totalLength} />
            </OverlayCircle>
          )}
          {ruler.attached && <PlacedToken id={ruler.attached} />}
        </Stack>
      </Layer>
      {!overlayInBounds && (
        <Box position="fixed" bottom={32} right={32}>
          <OverlayRectangle>
            <LengthsDisplay lastLength={lastLength} totalLength={totalLength} />
          </OverlayRectangle>
        </Box>
      )}
    </>
  );
};

type MeasurementProps = { id: string };


function inBounds(point: { x: number; y: number }, rect: { left: number; top: number; right: number; bottom: number }) {
  return point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;
}

function calcMetrics({ origin, points }: Ruler): RulerData {
  if (!origin) throw Error(`Parameter 'origin' is required.`);

  const path = `M ${origin.x},${origin.y} ${points.map(({ x, y }) => `${x},${y}`).join(' ')}`;

  const { segments, lastPoint, lastLength, totalLength, scaledX, scaledY } = points.reduce(
    ({ segments, lastPoint: start, totalLength }: PathData, end: Point) => {
      const width = end.x - start.x;
      const height = end.y - start.y;
      const hypot = Math.hypot(width, height);
      const scaledX = width / hypot;
      const scaledY = height / hypot;

      return {
        segments: segments + 1,
        lastPoint: end, // Ending of prior vector becomes start of next one.
        lastLength: hypot,
        totalLength: totalLength + hypot,
        scaledX,
        scaledY,
      };
    },
    {
      segments: 0,
      lastPoint: origin,
      lastLength: 0.0,
      totalLength: 0.0,
      scaledX: NaN,
      scaledY: NaN,
    }
  );

  return {
    path,
    origin,
    isSingle: segments === 1,
    lastPoint,
    lastLength: lastLength / CELL_SIZE,
    totalLength: totalLength / CELL_SIZE,
    scaledX,
    scaledY,
  };
}

type PathData = {
  segments: number;
  lastPoint: Point;
  lastLength: number;
  totalLength: number;
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

const toPercent = (number: number) => (number * 100).toFixed(4) + '%';
