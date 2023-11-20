import { Box } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Box for displaying children at the base token size.
 * @param Params - 
 */
export function UnscaledBox({ children }: UnscaledBoxProps) {
  return (
    <Box width="48px" height="48px">
      {children}
    </Box>
  );
}

export type UnscaledBoxProps = {
  children: ReactNode;
};
