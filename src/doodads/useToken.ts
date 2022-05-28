import { useCallback } from 'react';
import { useRecoilCallback, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { FullToken, Point, TokenColor, TokenID } from '../api/types';
import { baseDefaultState, baseOptionsState } from '../app/campaignState';
import { fullTokenState, selectedTokenIdState, tokenState } from '../app/tokenState';

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

  const setNotes = useCallback((notes: string) => setToken({ ...token, notes, path: [] }), [token, setToken]);

  const setTags = useCallback((tags: string[]) => setToken({ ...token, tags, path: [] }), [token, setToken]);

  const enlarge = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const token = await snapshot.getPromise(fullTokenState(tokenID));
        const baseDefault = await snapshot.getPromise(baseDefaultState);
        const baseOptions = [...(await snapshot.getPromise(baseOptionsState))];

        if (token?.shape.type !== 'figure') return;

        const oldSize = token.shape?.baseSize ?? baseDefault;
        const newSize = baseOptions.find((size) => oldSize < size) ?? oldSize;

        oldSize !== newSize && set(tokenState(tokenID), { ...token, shape: { ...token.shape, baseSize: newSize }, path: [] });
      },
    [tokenID]
  );

  const shrink = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const token = await snapshot.getPromise(fullTokenState(tokenID))!;
        const baseDefault = await snapshot.getPromise(baseDefaultState);
        const baseOptions = [...(await snapshot.getPromise(baseOptionsState))];

        if (token?.shape.type !== 'figure') return;

        const oldSize = token.shape?.baseSize ?? baseDefault;
        const newSize = baseOptions.reverse().find((size) => oldSize > size) ?? oldSize;

        oldSize !== newSize && set(tokenState(tokenID), { ...token, shape: { ...token.shape, baseSize: newSize }, path: [] });
      },
    [tokenID]
  );

  const enlargeAura = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const token = await snapshot.getPromise(fullTokenState(tokenID));
        const auraSizeDefault = 2;
        const auraSizeOptions = [1, 2, 3, 4, 5, 6];

        if (token?.shape.type !== 'marker') return;

        const oldSize = token.shape?.auraSize ?? auraSizeDefault;
        const newSize = auraSizeOptions.find((size) => oldSize < size) ?? oldSize;

        oldSize !== newSize && set(tokenState(tokenID), { ...token, shape: { ...token.shape, auraSize: newSize }, path: [] });
      },
    [tokenID]
  );

  const shrinkAura = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const token = await snapshot.getPromise(fullTokenState(tokenID))!;
        const auraSizeDefault = 2;
        const auraSizeOptions = [1, 2, 3, 4, 5, 6];

        if (token?.shape.type !== 'marker') return;

        const oldSize = token.shape?.auraSize ?? auraSizeDefault;
        const newSize = auraSizeOptions.reverse().find((size) => oldSize > size) ?? oldSize;

        oldSize !== newSize && set(tokenState(tokenID), { ...token, shape: { ...token.shape, auraSize: newSize }, path: [] });
      },
    [tokenID]
  );

  return [token, { stash, trash, setVisible, setActive, placeAt, setColor, enlarge, shrink, enlargeAura, shrinkAura, setNotes, setTags }];
}

type TokenCommands = {
  stash: () => void;
  trash: () => void;
  setVisible: (visible: boolean) => void;
  setActive: (active: boolean) => void;
  placeAt: (position: Point) => void;
  setColor: (color: TokenColor) => void;
  enlarge: () => void;
  shrink: () => void;
  enlargeAura: () => void;
  shrinkAura: () => void;
  setNotes: (notes: string) => void;
  setTags: (tags: string[]) => void;
};
