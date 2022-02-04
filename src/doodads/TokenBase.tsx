import styled from '@emotion/styled';
import { ReactNode } from 'react';

export function FigureBase({ title, children }: FigureBaseProps) {
  return <TokenShape title={title}>{children}</TokenShape>;
}

type FigureBaseProps = { title: string; children: ReactNode };

export const TokenShape = styled.div`
  display: grid;
  place-content: center;

  position: relative;

  width: 100%;
  height: 100%;

  border-radius: 50%;

  font-weight: 400;

  user-select: none;
`;
