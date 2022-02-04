import { Box } from '@mui/material';
import { ReactNode } from 'react';

export function ScalingBox({ scale, children }: ScalingBoxProps) {
  return (
    <Box width="48px" height="48px">
      <Box width="100%" height="100%" style={{ transform: `scale(${scale})` }}>
        {children}
      </Box>
    </Box>
  );
}

export type ScalingBoxProps = {
  scale: number;
  children: ReactNode;
};
