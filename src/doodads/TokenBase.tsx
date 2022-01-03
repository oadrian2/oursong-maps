import styled from '@emotion/styled';
import { forwardRef, ReactNode } from 'react';
import { TokenColor } from '../api/types';

export const TokenBase = forwardRef<HTMLDivElement, TokenBaseProps>(({ title, color, size = 'medium', children }, ref) => {
  return (
    <TokenShape ref={ref} title={title} color={color} size={size}>
      {children}
    </TokenShape>
  );
});

type TokenBaseProps = { title: string; color: TokenColor; children: ReactNode; size?: 'small' | 'medium' | 'large' };

TokenBase.displayName = 'TokenBase';

const colorMap: { [key in TokenColor]: string } = {
  red: '#d32f2f',
  green: '#00796b',
  blue: '#1976d2',
  yellow: '#ffeb3b',
  cyan: '#3bf8ff',
  magenta: '#ff3bf8',
};

export const TokenShape = styled.div<{ color: TokenColor; size: 'small' | 'medium' | 'large' }>`
  ${({ size }) => size === 'small' && '--borderSize: 3px; --tokenSize: 36px; --fontSize: 14px;'}
  ${({ size }) => size === 'medium' && '--borderSize: 4px; --tokenSize: 48px; --fontSize: 16px;'}
  ${({ size }) => size === 'large' && '--borderSize: 5px; --tokenSize: 60px; --fontSize: 22px;'}

  display: grid;
  place-content: center;

  width: var(--tokenSize);
  height: var(--tokenSize);

  font-size: var(--fontSize);

  position: relative;
  overflow: hidden;

  border: var(--borderSize) solid ${({ color }: { color: TokenColor }) => colorMap[color]};
  border-radius: 50%;

  background: black;
  color: white;

  font-weight: 400;

  user-select: none;
`;
