import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { api } from '../api/ws';
import { MapID, tokenListState } from '../map/State';

export function useMap({ game, id }: MapID) {
  const [connected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const setTokenList = useSetRecoilState(tokenListState);

  useEffect(() => {
    if (!connected) return;

    api.connection.on('worldState', ({ tokens }) => {
      setTokenList(tokens);
    });

    api.joinMap(game, id);
  }, [setTokenList, connected, game, id]);

  return [loaded];
}
