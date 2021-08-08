import styled from '@emotion/styled';
import { forwardRef } from 'react';

const CELL_SIZE = 48.0;

export const MarkerToken = forwardRef<HTMLDivElement, MarkerTokenProps>(
  ({ color = 'green', effectRadius = 0, label, isTemplate = false }, ref) => {
    const hue = {
      red: 0,
      green: 120,
      blue: 240,
      yellow: 120,
    }[color];

    const radius = CELL_SIZE * effectRadius;

    return (
      <MarkerTokenShape ref={ref} title={label} hue={hue} radius={radius}>
        {!!radius && <MarkerTokenAura />}
        <MarkerTokenPlacemat />
        <MarkerTokenImage src={`/marker-${color}-512.png`} draggable="false" alt={label} />
      </MarkerTokenShape>
    );
  }
);

MarkerToken.displayName = 'MarkerToken';

export type MarkerColor = 'red' | 'green' | 'blue' | 'yellow';

export type MarkerTokenProps = { color?: MarkerColor; effectRadius?: number; label: string; isTemplate?: boolean };

export const MarkerTokenShape = styled.div<{ hue: number; radius: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  --color: ${({ hue }: { hue: number }) => hue};
  --radius: ${({ radius }: { radius: number }) => radius}px;
`;

MarkerTokenShape.displayName = 'MarkerTokenShape';

export const MarkerTokenImage = styled.img`
  width: 32px;
  margin-top: -32px;
`;

MarkerTokenImage.displayName = 'MarkerTokenImage';

export const MarkerTokenPlacemat = styled.div`
  position: absolute;

  width: 12px;
  height: 12px;

  border: 2px solid transparent;
  border-radius: 50%;

  background-color: hsl(var(--color), 40%, 30%);

  z-index: -1;

  pointer-events: none;
`;

MarkerTokenPlacemat.displayName = 'MarkerTokenPlacemat';

export const MarkerTokenAura = styled.div`
  position: absolute;

  width: var(--radius);
  height: var(--radius);

  border: 2px solid hsl(var(--color), 100%, 60%);
  border-radius: 50%;

  background-color: hsl(var(--color), 100%, 30%);

  opacity: 0.3;

  z-index: -1;

  pointer-events: none;
`;

MarkerTokenAura.displayName = 'MarkerTokenAura';
