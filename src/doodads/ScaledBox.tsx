import { Box } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Box for displaying children at a multiple of the base token size.
 * @param Params - 
 */
export function ScaledBox({ scale, children }: ScaledBoxProps) {
  return (
    <Box width="48px" height="48px">
      <Box width="100%" height="100%" style={{ transform: `scale(${scale})` }}>
        {children}
      </Box>
    </Box>
  );
}

export type ScaledBoxProps = {
  /**
   * Scale to apply to children.
   */
  scale: number;
  children: ReactNode;
};
