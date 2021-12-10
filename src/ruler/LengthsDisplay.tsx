import styled from '@emotion/styled';

export function LengthsDisplay({ lastLength, totalLength }: LengthsDisplayProps) {
  return (
    <MeasurementText>
      <strong>C:</strong>
      <span>{lastLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
      <strong>T:</strong>
      <span>{totalLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
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
