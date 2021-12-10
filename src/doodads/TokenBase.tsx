import styled from '@emotion/styled';
import { forwardRef, ReactNode } from 'react';
import { TokenColor } from '../api/types';

export const TokenBase = forwardRef<HTMLDivElement, TokenBaseProps>(({ title, color, children }, ref) => {
  return (
    <TokenShape ref={ref} title={title} color={color}>
      {children}
    </TokenShape>
  );
});

type TokenBaseProps = { title: string; color: TokenColor; children: ReactNode };

TokenBase.displayName = 'TokenBase';

const colorMap: { [key in TokenColor]: string } = {
  red: '#d32f2f',
  green: '#00796b',
  blue: '#1976d2',
  yellow: '#ffeb3b',
  cyan: '#3bf8ff',
  magenta: '#ff3bf8',
};

export const TokenShape = styled.div`
  display: grid;
  place-content: center;

  width: var(--tokenSize);
  height: var(--tokenSize);

  position: relative;
  overflow: hidden;

  border: 4px solid ${({ color }: { color: TokenColor }) => colorMap[color]};
  border-radius: 50%;

  background: black;
  color: white;

  font-weight: 400;

  user-select: none;
`;
