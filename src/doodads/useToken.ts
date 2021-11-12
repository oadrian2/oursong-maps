import { useCallback } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { Point, TokenColor, TokenID } from '../api/types';
import { FullToken, fullTokenState, selectedTokenIdState, tokenState } from '../app/tokenState';

export function useToken(tokenID: TokenID): [FullToken, TokenCommands] {
  const token = useRecoilValue(fullTokenState(tokenID));
  const setToken = useSetRecoilState(tokenState(tokenID));
  const resetSelectedTokenId = useResetRecoilState(selectedTokenIdState);

  if (!token) throw Error(`Token '${tokenID}' does not exist.`);

  const stash = useCallback(() => {
    resetSelectedTokenId();

    setToken({ ...token, position: null, path: [] });
  }, [token, setToken, resetSelectedTokenId]);

  const trash = useCallback(() => {
    resetSelectedTokenId();

    setToken({ ...token, deleted: true, path: [] });
  }, [token, setToken, resetSelectedTokenId]);

  const setVisible = useCallback((visible: boolean) => setToken({ ...token, visible, path: [] }), [token, setToken]);

  const setActive = useCallback((active: boolean) => setToken({ ...token, active, path: [] }), [token, setToken]);

  const placeAt = useCallback((position: Point) => setToken({ ...token, position, path: [] }), [token, setToken]);

  const setColor = useCallback(
    (color: TokenColor) => setToken({ ...token, shape: { ...token.shape, color }, path: [] }),
    [token, setToken]
  );

  return [token, { stash, trash, setVisible, setActive, placeAt, setColor }];
}

type TokenCommands = {
  stash: () => void;
  trash: () => void;
  setVisible: (visible: boolean) => void;
  setActive: (active: boolean) => void;
  placeAt: (position: Point) => void;
  setColor: (color: TokenColor) => void;
};
