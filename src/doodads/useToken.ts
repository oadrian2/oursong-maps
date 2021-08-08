import { useCallback } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { Point } from '../app/math';
import { selectedTokenIdState, Token, TokenID, tokenState } from '../app/tokenState';

export function useToken(tokenID: TokenID): [Token, TokenCommands] {
  const [token, setToken] = useRecoilState(tokenState(tokenID));
  const resetSelectedTokenId = useResetRecoilState(selectedTokenIdState);

  if (!token) throw Error(`Token '${tokenID}' does not exist.`);

  const stash = useCallback(() => {
    resetSelectedTokenId();

    setToken({ ...token, position: null, path: null });
  }, [token, setToken, resetSelectedTokenId]);

  const trash = useCallback(() => {
    resetSelectedTokenId();

    setToken({ ...token, deleted: true, path: null });
  }, [token, setToken, resetSelectedTokenId]);

  const setVisible = useCallback((visible: boolean) => setToken({ ...token, visible, path: null }), [token, setToken]);

  const setActive = useCallback((active: boolean) => setToken({ ...token, active, path: null }), [token, setToken]);

  const placeAt = useCallback((position: Point) => setToken({ ...token, position, path: null }), [token, setToken])

  return [token, { stash, trash, setVisible, setActive, placeAt }];
}

type TokenCommands = {
  stash: () => void;
  trash: () => void;
  setVisible: (visible: boolean) => void;
  setActive: (active: boolean) => void;
  placeAt: (position: Point) => void;
};
