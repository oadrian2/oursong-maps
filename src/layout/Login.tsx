import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { meState } from '../stores/userStore';

export function Login() {
  const me = useRecoilValue(meState);
  const location = useLocation();

  return !!me ? (
    <Button color="inherit" href={`/.auth/logout/google?post_logout_redirect_uri=${location.pathname}`}>
      Logout
    </Button>
  ) : (
    <Button color="inherit" href={`/.auth/login/google?post_login_redirect_uri=${location.pathname}`}>
      Login
    </Button>
  );
}
