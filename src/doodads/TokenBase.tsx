import { styled } from '@mui/material/styles';

export const FigureBase = styled('div')(({ theme }) => ({
  display: 'grid',
  placeContent: 'center',

  position: 'relative',

  width: '100%',
  height: '100%',

  borderRadius: '50%',

  fontWeight: 400,

  userSelect: 'none',

  boxShadow: theme.shadows[1],
}));
