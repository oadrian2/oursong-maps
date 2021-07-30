import styled from '@emotion/styled';
import { degToRad, offsetAngle, Point } from '../app/math';

export const ArcCircle = ({ origin, target }: ArcCircleProps) => {
  const radius = Math.hypot(target.x - origin.x, target.y - origin.y);

  const negPosition = offsetAngle(origin, target, degToRad(-15));
  const posPosition = offsetAngle(origin, target, degToRad(+15));

  const sprayShape = `M ${negPosition.x} ${negPosition.y} A ${radius} ${radius} 0 0 1 ${posPosition.x} ${posPosition.y} L ${origin.x} ${origin.y} Z`;

  return (
    <>
      <OverlayShape d={sprayShape} />
      <circle cx={origin.x} cy={origin.y} r={radius} className="back-stroke" />
      <circle cx={origin.x} cy={origin.y} r={radius} className="fore-stroke" />
    </>
  );
};

type ArcCircleProps = { origin: Point; target: Point };

export const OverlayShape = styled.path`
  fill: hsla(0, 0%, 80%, 0.25);
  stroke: hsla(0, 0%, 80%, 0.5);
  stroke-width: 1px;
`;

OverlayShape.displayName = 'OverlayShape';
