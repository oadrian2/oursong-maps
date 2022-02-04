import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { cellSizeState } from '../app/campaignState';
import { roundToStep } from '../app/math';

export function LengthsDisplay({ lastLength, totalLength }: LengthsDisplayProps) {
  const { amount, unit } = useRecoilValue(cellSizeState);

  const lastLengthToStep = roundToStep(amount * lastLength, amount / 10);
  const totalLengthToStep = roundToStep(amount * totalLength, amount / 10);

  return (
    <MeasurementText>
      <strong>C:</strong>
      <span>
        {lastLengthToStep.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1, style: 'unit', unit })}
      </span>
      <strong>T:</strong>
      <span>
        {totalLengthToStep.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1, style: 'unit', unit })}
      </span>
    </MeasurementText>
  );
}

export type LengthsDisplayProps = { lastLength: number; totalLength: number };

export const MeasurementText = styled.div`
  display: grid;
  grid-template: auto / auto auto;
  place-content: center space-between;
  gap: 4px;

  font-weight: 500;

  min-width: 6rem;

  line-height: 1.25;

  white-space: nowrap;
`;

MeasurementText.displayName = 'MeasurementText';

export const OverlayCircle = styled.div`
  display: grid;

  background-color: #eeeeee80;
  color: black;

  border: 2px solid black;
  border-radius: 50%;

  padding: 1.25rem;

  aspect-ratio: 1;

  text-shadow: 0px 0px 4px #fff;
  backdrop-filter: blur(4px);
`;

OverlayCircle.displayName = 'OverlayCircle';

export const OverlayRectangle = styled.div`
  display: grid;

  background-color: #eeeeee80;
  color: black;

  border: 2px solid black;
  border-radius: 4px;

  padding: 0.75rem 1rem;

  text-shadow: 0px 0px 4px #fff;
  backdrop-filter: blur(4px);
`;

OverlayRectangle.displayName = 'OverlayRectangle';
