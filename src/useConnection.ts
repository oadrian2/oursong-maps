import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinMapRequested, leaveMapRequested, selectConnected } from './map/mapSlice';

export function useConnection({ game, id }: { game: string; id: string }) {
  const dispatch = useDispatch();

  const connected = useSelector(selectConnected);

  useEffect(() => {
    if (!connected) return;

    dispatch(joinMapRequested(game, id));

    return () => {
      dispatch(leaveMapRequested(game, id));
    };
  }, [connected, dispatch, game, id]);
}
