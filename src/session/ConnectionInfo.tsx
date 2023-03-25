import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { isGMState, userIdState } from "../app/userState";
import { meState } from '../stores/userStore';


export function ConnectionInfo() {
  const userId = useRecoilValue(userIdState);
  const isGM = useRecoilValue(isGMState);
  const me = useRecoilValue(meState);

  return (
    <Box position="fixed" bottom={16} left={16} bgcolor="black" color="white" p={1}>
      {me?.userDetails ?? userId} {isGM ? ' (GM)' : '(Player)'}
    </Box>
  );
}
