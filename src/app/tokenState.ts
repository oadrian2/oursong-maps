import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { distinctUntilChanged } from 'rxjs';
import { FigureShape, FullToken, isFigureShape, isMarkerShape, MarkerShape, Placement, Token, TokenID } from '../api/types';
import { api } from '../api/ws';
import { routedGameKeyState, routedMapKeyState } from '../stores/routedState';
import { baseDefaultState, hasFacingState } from './campaignState';
import { controlledGeneratorListState, generatorState, viewInactiveState } from './mapState';
import { isGMState } from './userState';

export const selectedTokenIdState = atom<TokenID | null>({
  key: 'SelectedTokenId',
  default: null,
});

export const routedMapTokens = atom<TokenID[]>({
  key: 'RoutedTokenIDs',
  default: selector<TokenID[]>({
    key: 'RoutedTokenIDs/Default',
    get: ({ get }) => api.getMapTokens(get(routedGameKeyState), get(routedMapKeyState)),
  }),
});

export const tokenIDsState = atom<TokenID[]>({
  key: 'TokenIDs',
  default: selector<TokenID[]>({
    key: 'TokenIDs/Default',
    get: () => api.getTokens(),
  }),
  effects: [
    ({ setSelf }) => {
      const subscription = api.tokenListChanges
        .pipe(distinctUntilChanged((p: TokenID[], c: TokenID[]) => p.length === c.length && p.every((pi) => c.includes(pi))))
        .subscribe((ids) => setSelf(ids));

      return () => subscription.unsubscribe();
    },
  ],
});

export const tokenState = atomFamily<Token, TokenID>({
  key: 'Token',
  default: selectorFamily<Token, TokenID>({
    key: 'Token/Default',
    get: (id: TokenID) => async () => api.getToken(id),
  }),
  effects: (id) => [
    ({ onSet, setSelf }) => {
      const subscription = api.tokenChanges.subscribe(([tokenID, token]) => tokenID === id && setSelf(token));

      onSet((token, oldToken) => token !== oldToken && api.updateToken(id, token));

      return () => subscription.unsubscribe();
    },
  ],
});

export const tokenIndexState = selectorFamily<number, TokenID>({
  key: 'TokenIndex',
  get:
    (selfID: TokenID) =>
    ({ get }) => {
      const { generator: selfGenerator } = get(tokenState(selfID));

      return get(tokenIDsState)
        .map((id: TokenID) => [id, get(tokenState(id))] as [TokenID, Token])
        .filter(([_, { generator }]) => selfGenerator === generator)
        .findIndex(([id]) => id === selfID);
    },
});

export const fullTokenState = selectorFamily<FullToken | null, TokenID | null>({
  key: 'FullToken',
  get:
    (id: TokenID | null) =>
    ({ get }) => {
      if (!id) return null;

      const hasFacing = get(hasFacingState);
      const baseDefault = get(baseDefaultState);

      const token = get(tokenState(id));
      const index = get(tokenIndexState(id));
      const generator = get(generatorState(token.generator))!;

      const { name, shape: generatorShape } = generator;
      const { facing, shape: tokenShape = {}, ...restToken } = token;

      const label = generatorShape.type === 'figure' ? `${generatorShape.label}${generatorShape.isGroup ? index + 1 : index || ''}` : '';

      const shape = isFigureShape(generatorShape)
        ? ({ ...generatorShape, ...tokenShape } as FigureShape)
        : isMarkerShape(generatorShape)
        ? ({ ...generatorShape, ...tokenShape } as MarkerShape)
        : (null as never);

      const scale = 'baseSize' in shape ? shape.baseSize / baseDefault : 0.0;

      return {
        ...restToken,
        name,
        label,
        shape,
        facing: hasFacing ? facing : null,
        scale,
      };
    },
});

export type TokenCapabilities = {
  canMove: boolean;
  canTrash: boolean;
  canStash: boolean;
  canColor: boolean;
  canSize: boolean;
  canKill: boolean;
  canHide: boolean;
  canChangeAura: boolean;
};

export const tokenCapabilityState = selectorFamily<TokenCapabilities, TokenID>({
  key: 'TokenCapability',
  get:
    (id: TokenID) =>
    ({ get }) => {
      const token = get(fullTokenState(id));
      const isGM = get(isGMState);

      if (!token) throw new Error('Augh!');

      if (isFigureShape(token.shape)) {
        return {
          canMove: true,
          canTrash: isGM,
          canStash: true,
          canColor: true,
          canSize: true,
          canKill: true,
          canHide: true,
          canChangeAura: false,
        };
      }

      if (isMarkerShape(token.shape)) {
        return {
          canMove: true,
          canTrash: isGM,
          canStash: false,
          canColor: isGM,
          canSize: false,
          canKill: false,
          canHide: isGM,
          canChangeAura: true,
        };
      }

      throw new Error('Augh!');
    },
});

export const tokenPlacementsState = selector<[TokenID, Placement][]>({
  key: 'TokenPlacements',
  get: ({ get }) =>
    get(tokenIDsState)
      .map((id) => [id, get(tokenState(id))] as [TokenID, Token])
      .filter(([_, token]) => token.position !== null)
      .map(([id, { position, facing }]) => [id, { position, facing, scale: 1.0 } as Placement]),
});

export const activeTokenIDsState = selector<TokenID[]>({
  key: 'ActiveTokenIDs',
  get: ({ get }) => {
    const viewInactive = get(viewInactiveState);
    const selectedTokenId = get(selectedTokenIdState);

    return [
      ...get(tokenIDsState)
        .map(
          (id) => [id, get(tokenState(id)), get(isTokenVisibleState(id)), get(tokenEffectiveSize(id))] as [TokenID, Token, boolean, number]
        )
        .filter(
          ([id, { position, deleted, active }, isVisible]) =>
            !!position && !deleted && isVisible && (active || id === selectedTokenId || viewInactive)
        ),
    ]
      .sort(([, , , a], [, , , b]) => b - a) // we sort them by size so that large tokens are below smaller ones
      .map(([id]) => id);
  },
});

export const stashedTokenIDsState = selector<TokenID[]>({
  key: 'StashedTokenIDs',
  get: ({ get }) =>
    get(tokenIDsState).filter((id) => {
      const { position, deleted = false } = get(tokenState(id));

      return !position && !deleted;
    }),
});

export const isTokenVisibleState = selectorFamily<boolean, TokenID>({
  key: 'IsTokenVisible',
  get:
    (tokenID: TokenID) =>
    ({ get }) => {
      const { visible, generator } = get(tokenState(tokenID));
      const controlledGeneratorList = get(controlledGeneratorListState);

      return !!visible || controlledGeneratorList.includes(generator);
    },
});

export const tokenEffectiveSize = selectorFamily<number, TokenID>({
  key: 'TokenEffectiveSize',
  get:
    (tokenID: TokenID) =>
    ({ get }) => {
      const token = get(fullTokenState(tokenID));

      switch (token!.shape.type) {
        case 'figure':
          return token?.shape.baseSize ?? 30.0;
        case 'marker':
          return token?.shape.auraSize ?? 0.0;
        default:
          return null as never;
      }
    },
});
