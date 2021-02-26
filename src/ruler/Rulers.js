import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { PlacedToken } from '../map/PlacedToken';
import './Rulers.css';
import { selectRulerMetrics } from './rulerSlice';

export function Rulers({ isMoving }) {
  const rulerMetrics = useSelector(selectRulerMetrics);
  const movingTokenId = useSelector((state) => state.tokens.moving);

  return rulerMetrics.map(({ id, isSingle, origin, path, radius, lastPoint, lastLength, totalLength, scaledX, scaledY }) => (
    <Fragment key={id}>
      <svg className="measurement-layer">
        <defs>
          <marker id="arrowhead" markerUnits="strokeWidth" markerWidth="5" markerHeight="2.5" refX="5" refY="1.25" orient="auto">
            <polygon points="0 0, 5 1.25, 0 2.5" />
          </marker>
        </defs>
        <path d={path} className="back-stroke" markerEnd="url(#arrowhead)" />
        <path d={path} className="fore-stroke" markerEnd="url(#arrowhead)" />
        {isSingle && (
          <>
            <circle cx={origin.x} cy={origin.y} r={radius} className="back-stroke" />
            <circle cx={origin.x} cy={origin.y} r={radius} className="fore-stroke" />
          </>
        )}
        <path d={path} className="back-stroke" markerEnd="url(#arrowhead)" />
        <path d={path} className="fore-stroke" markerEnd="url(#arrowhead)" />
      </svg>
      <div
        className="measurement-lengths"
        style={{
          left: lastPoint.x,
          top: lastPoint.y,
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
      {isMoving && movingTokenId && (
        <div style={{ position: 'absolute', left: lastPoint.x, top: lastPoint.y, transform: 'translate(-50%, -50%)' }}>
          <PlacedToken id={movingTokenId} showMenu={false} />
        </div>
      )}
    </Fragment>
  ));
}
