import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { isGMState, userIdState } from "../app/userState";


export function ConnectionInfo() {
  const userId = useRecoilValue(userIdState);
  const isGM = useRecoilValue(isGMState);

  return (
    <Box position="fixed" bottom={16} left={16} bgcolor="black" color="white" p={1}>
      {userId} {isGM ? ' (GM)' : '(Player)'}
    </Box>
  );
}
