import styled from '@emotion/styled';
import { forwardRef, ReactNode } from 'react';

export const TokenBase = forwardRef<HTMLDivElement, TokenBaseProps>(({ title, color, children }, ref) => {
  return (
    <TokenShape ref={ref} title={title} color={color}>
      {children}
    </TokenShape>
  );
});

type TokenBaseProps = { title: string; color: ColorKey; children: ReactNode };

TokenBase.displayName = 'TokenBase';

const colorMap = {
  red: '#d32f2f',
  blue: '#1976d2',
  yellow: '#ffeb3b',
  green: '#00796b',
};

export type ColorKey = keyof typeof colorMap;

export const TokenShape = styled.div`
  display: grid;
  place-content: center;

  width: 3rem;
  height: 3rem;

  position: relative;
  overflow: hidden;

  border: 2px solid ${({ color }: { color: ColorKey }) => colorMap[color]};
  border-radius: 50%;

  background: black;
  color: white;

  font-weight: 400;

  user-select: none;
`;
