import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userIdState } from "../app/userState";


export function ConnectionInfo() {
  const userId = useRecoilValue(userIdState);

  return (
    <Box position="fixed" bottom={16} left={16} bgcolor="black" color="white" p={1}>
      {userId}
    </Box>
  );
}
