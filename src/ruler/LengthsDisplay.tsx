import { SpokePositioned, MeasurementCircle } from './Rulers';

export function LengthsDisplay({ scaledX, scaledY, lastLength, totalLength }: LengthsDisplayProps) {
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

export type LengthsDisplayProps = { scaledX: string; scaledY: string; lastLength: number; totalLength: number };
