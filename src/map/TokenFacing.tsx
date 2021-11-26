import { Facing } from '../api/types';
import { CELL_DIAMETER, CELL_RADIUS, degToRad, offsetAngle } from '../app/math';

const INDICATOR_ARC = 20.0;
const INDICATOR_DEPTH = 8.0;

const ORIGIN = { x: 0, y: 0 };
const EDGE = { x: CELL_RADIUS, y: 0 };

const BOT = offsetAngle(ORIGIN, EDGE, degToRad(-INDICATOR_ARC / 2));
const TOP = offsetAngle(ORIGIN, EDGE, degToRad(+INDICATOR_ARC / 2));

const TIP = { x: CELL_RADIUS - INDICATOR_DEPTH, y: ORIGIN.x };

const FACING_PATH = `M ${BOT.x} ${BOT.y} A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${TOP.x} ${TOP.y} L ${TIP.x} ${TIP.y}`;

export function TokenFacing({ facing }: TokenFacingProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`-${CELL_RADIUS} -${CELL_RADIUS} ${CELL_DIAMETER} ${CELL_DIAMETER}`}
      style={{ position: 'absolute', top: 0, transform: `rotate(${facing}rad)`, pointerEvents: 'none', width: '100%', height: '100%' }}
    >
      <path d={FACING_PATH} fill="white" opacity={0.87} />
    </svg>
  );
}

export type TokenFacingProps = { facing: Facing };
