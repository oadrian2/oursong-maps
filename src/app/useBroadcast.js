import { useDispatch } from 'react-redux';

export function useBroadcast() {
  const dispatch = useDispatch();

  return (innerAction) => {
    const payload = typeof innerAction === 'function' ? innerAction() : innerAction;

    dispatch({ type: 'broadcast', payload });
  };
}
