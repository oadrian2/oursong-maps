import { Box } from '@mui/material';
import SkullIcon from '../icons/Skull';
import { CELL_DIAMETER } from '../app/math';

export function DeathMarker() {
  return (
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        placeContent: 'center',
        color: 'white',
        opacity: 0.5,
      }}
    >
      <SkullIcon style={{ width: CELL_DIAMETER * 0.75, height: CELL_DIAMETER * 0.75 }} />
    </Box>
  );
}
