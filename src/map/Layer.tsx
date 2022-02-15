import { styled } from '@mui/material';

export const Layer = styled('div')<{ interactive?: boolean }>`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;

  pointer-events: ${({ interactive }) => (!!interactive ? 'auto' : 'none')};
`;

Layer.displayName = 'Layer';

export const Stack = styled('div')`
  position: absolute;

  display: grid;
  place-items: center;

  > * { position: absolute; }
`;

Stack.displayName = 'Stack';

export const SvgLayer = Layer.withComponent('svg');
