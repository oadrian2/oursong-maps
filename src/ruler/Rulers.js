import styled from '@emotion/styled';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { degToRad, offsetAngle } from '../app/math';
import { PlacedToken } from '../map/PlacedToken';
import { selectSelectedTokenId } from '../map/selectionSlice';
import './Rulers.css';
import { selectRulerMetrics } from './rulerSlice';

export function Rulers({ isMoving }) {
  const rulerMetrics = useSelector(selectRulerMetrics);
  const selectedTokenId = useSelector(selectSelectedTokenId);

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
        <div style={{ position: 'absolute', top: 0, transform: `translate(${lastPoint.x}px, ${lastPoint.y}px)` }}>
          <LengthsDisplay scaledX={scaledX} scaledY={scaledY} lastLength={lastLength} totalLength={totalLength} />
          {isMoving && selectedTokenId && (
            <div style={{ position: 'absolute', top: 0, transform: `translate(-50%, -50%)` }}>
              <PlacedToken id={selectedTokenId} showMenu={false} />
            </div>
          )}
        </div>
      </Fragment>
    );
  });
}

export function ArcCircle({ origin, lastPoint, radius }) {
  const negPosition = offsetAngle(origin, lastPoint, degToRad(-15));
  const posPosition = offsetAngle(origin, lastPoint, degToRad(+15));

  const sprayShape = `M ${negPosition.x} ${negPosition.y} A ${radius} ${radius} 0 0 1 ${posPosition.x} ${posPosition.y} L ${origin.x} ${origin.y} Z`;

  return (
    <>
      <OverlayShape d={sprayShape} />
      <circle cx={origin.x} cy={origin.y} r={radius} className="back-stroke" />
      <circle cx={origin.x} cy={origin.y} r={radius} className="fore-stroke" />
    </>
  );
}

export function LengthsDisplay({ scaledX, scaledY, lastLength, totalLength }) {
  return (
    <SpokePositioned scaledX={scaledX} scaledY={scaledY}>
      <MeasurementCircle>
        <strong>C:</strong>
        <span>{lastLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
        <strong>T:</strong>
        <span>{totalLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
      </MeasurementCircle>
    </SpokePositioned>
  );
}

export const CenterPositioned = styled.div`
  position: absolute;
  top: 0;
  transform: translate(-50%, -50%);
`;

export const SpokePositioned = styled.div`
  position: absolute;
  top: 0;
  transform: translate(calc(${({ scaledX }) => scaledX} * 1.25), calc(${({ scaledY }) => scaledY} * 1.25));
`;

export const OverlayShape = styled.path`
  fill: hsla(0, 0%, 80%, 0.25);
  stroke: hsla(0, 0%, 80%, 0.5);
  stroke-width: 1px;
`;

OverlayShape.displayName = 'OverlayShape';

export const MeasurementCircle = styled.div`
  transform: translate(-50%, -50%);

  display: grid;
  grid-template: auto / auto auto;
  justify-content: space-between;
  align-content: center;
  gap: 4px;

  background: #eeeeee80;
  font-weight: 500;

  border: 2px solid black;
  border-radius: 50%;
  padding: 1.25rem;
  height: 8em;
  width: 8rem;

  text-shadow: 0px 0px 4px #fff;
  backdrop-filter: blur(4px);
`;

MeasurementCircle.displayName = 'MeasurementCircle';
