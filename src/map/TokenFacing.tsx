import { Facing } from '../api/types';
import { CELL_DIAMETER, CELL_RADIUS, degToRad, offsetAngle } from '../app/math';

export type TokenFacingProps = { facing: Facing };

export function TokenFacing({ facing }: TokenFacingProps) {
  const origin = { x: 0, y: 0 };
  const edge = { x: CELL_RADIUS, y: 0 };
  const bot = offsetAngle(origin, edge, degToRad(-INDICATOR_ANGLE / 2));
  const top = offsetAngle(origin, edge, degToRad(+INDICATOR_ANGLE / 2));

  const tipX = CELL_RADIUS - 8.0; /* tip length */
  const tipY = origin.y;

  const facingPath = `M ${bot.x} ${bot.y} A ${CELL_RADIUS} ${CELL_RADIUS} 0 0 1 ${top.x} ${top.y} L ${tipX} ${tipY}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`-${CELL_RADIUS} -${CELL_RADIUS} ${CELL_DIAMETER} ${CELL_DIAMETER}`}
      style={{ position: 'absolute', top: 0, transform: `rotate(${facing}rad)`, pointerEvents: 'none', opacity: 0.87 }}
    >
      <path d={facingPath} fill="white" />
    </svg>
  );
}

const INDICATOR_ANGLE = 20.0;
