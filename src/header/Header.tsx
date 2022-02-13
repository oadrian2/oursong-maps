import { Box } from '@mui/material';
import { useTitle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { mapTitleState } from '../app/mapState';

export function Header() {
  const title = useRecoilValue(mapTitleState);

  useTitle(`OurSong Maps - ${title}`);

  return (
    <Box component="span" fontSize="2.5rem">
      {title}
    </Box>
  );
}
