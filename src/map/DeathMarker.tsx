import { Box } from '@mui/material';
import SkullIcon from '../icons/Skull';

export function DeathMarker() {
  return (
    <Box position="absolute" top={0} display="flex" color="white" width="100%" height="100%" alignItems="center" justifyContent="center" style={{opacity: 0.5}}>
      <SkullIcon style={{ width: '75%', height: '75%' }} />
    </Box>
  );
}
