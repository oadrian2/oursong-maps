import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { degToRad, offsetAngle } from '../app/math';
import { PlacedToken } from '../map/PlacedToken';
import './Rulers.css';
import { selectRulerMetrics } from './rulerSlice';

export function Rulers({ isMoving }) {
  const rulerMetrics = useSelector(selectRulerMetrics);
  const movingTokenId = useSelector((state) => state.tokens.moving);

  return rulerMetrics.map(({ id, isSingle, origin, path, radius, lastPoint, lastLength, totalLength, scaledX, scaledY }) => {
    return (
      <Fragment key={id}>
        <svg className="measurement-layer">
          <defs>
            <marker id="arrowhead" markerUnits="strokeWidth" markerWidth="5" markerHeight="2.5" refX="5" refY="1.25" orient="auto">
              <polygon points="0 0, 5 1.25, 0 2.5" />
            </marker>
          </defs>
          <path d={path} className="back-stroke" markerEnd="url(#arrowhead)" />
          <path d={path} className="fore-stroke" markerEnd="url(#arrowhead)" />
          {isSingle && <ArcCircle origin={origin} radius={radius} lastPoint={lastPoint} />}
        </svg>
        <LengthsDisplay position={lastPoint} scaledX={scaledX} scaledY={scaledY} lastLength={lastLength} totalLength={totalLength} />
        {isMoving && movingTokenId && (
          <div style={{ position: 'absolute', left: lastPoint.x, top: lastPoint.y, transform: 'translate(-50%, -50%)' }}>
            <PlacedToken id={movingTokenId} showMenu={false} />
          </div>
        )}
      </Fragment>
    );
  });
}

export function ArcCircle({ origin, lastPoint, radius }) {
  const negPosition = offsetAngle(origin, lastPoint, degToRad(-15));
  const posPosition = offsetAngle(origin, lastPoint, degToRad(+15));

  const path = `M ${negPosition.x} ${negPosition.y} A ${radius} ${radius} 0 0 1 ${posPosition.x} ${posPosition.y} L ${origin.x} ${origin.y} Z`;

  return (
    <>
      <path className="arc" d={path} />
      <circle cx={origin.x} cy={origin.y} r={radius} className="back-stroke" />
      <circle cx={origin.x} cy={origin.y} r={radius} className="fore-stroke" />
    </>
  );
}

export function LengthsDisplay({ position, scaledX, scaledY, lastLength, totalLength }) {
  return (
    <div
      className="measurement-lengths"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(calc(-50% + (${scaledX}) * 1.25), calc(-50% + (${scaledY}) * 1.25)`,
      }}
    >
      <div className="measurement-length">
        <strong>C:</strong>
        <span>{lastLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
      </div>
      <div className="measurement-length">
        <strong>T:</strong>
        <span>{totalLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
      </div>
    </div>
  );
}
