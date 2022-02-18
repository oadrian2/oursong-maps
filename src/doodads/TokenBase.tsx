import { styled } from '@mui/material';

export const FigureBase = styled('div')`
  display: grid;
  place-content: center;

  position: relative;

  width: 100%;
  height: 100%;

  border-radius: 50%;

  font-weight: 400;

  user-select: none;

  box-shadow: ${({ theme }) => theme.shadows[1]};

  line-height: 1.2;
`;
