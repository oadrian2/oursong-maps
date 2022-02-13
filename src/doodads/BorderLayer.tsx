import { Box } from '@mui/material';
import { TokenColor } from '../api/types';

const colorMap: { [key in TokenColor]: string } = {
  red: '#d32f2f',
  green: '#00796b',
  blue: '#1976d2',
  yellow: '#ffeb3b',
  cyan: '#3bf8ff',
  magenta: '#ff3bf8',
};

export function BorderLayer({ color }: BorderLayerProps) {
  return (
    <Box
      sx={{
        position: 'absolute',

        border: '4px solid transparent',
        borderColor: colorMap[color],

        background: 'black',
        color: 'transparent',

        borderRadius: '50%',

        width: '100%',
        height: '100%',
      }}
    />
  );
}

export type BorderLayerProps = { color: TokenColor };
