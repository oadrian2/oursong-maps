import styled from '@emotion/styled';

export function LengthsDisplay({ lastLength, totalLength }: LengthsDisplayProps) {
  return (
    <MeasurementCircle>
      <strong>C:</strong>
      <span>{lastLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
      <strong>T:</strong>
      <span>{totalLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
    </MeasurementCircle>
  );
}

export type LengthsDisplayProps = { lastLength: number; totalLength: number };

export const MeasurementCircle = styled.div`
  /* transform: translate(-50%, -50%); */

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
