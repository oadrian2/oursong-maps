import { styled } from '@mui/material';
import { Point } from '../api/types';

export const Layer = styled('div')<{ interactive?: boolean }>`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;

  pointer-events: ${({ interactive }) => (!!interactive ? 'auto' : 'none')};
`;

Layer.displayName = 'Layer';

export const Positioned = styled('div')<{ at?: Point }>`
  position: absolute;

  display: grid;
  grid-template: 1 fr / 1 fr;
  place-items: center;

  ${({ at }) => !!at && `transform: translate(${at.x}px, ${at.y}px)`};
`;

Positioned.displayName = 'Positioned';

export const SvgLayer = Layer.withComponent('svg');
