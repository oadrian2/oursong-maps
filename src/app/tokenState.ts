import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { FigureShape, isFigureShape, isMarkerShape, MarkerShape, Placement, Scale, Token, TokenID } from '../api/types';
import { api } from '../api/ws';
import { baseDefaultState, hasFacingState } from './campaignState';
import { controlledGeneratorListState, generatorState, viewInactiveState } from './mapState';
import { centerToCenterNormalizedCellDistance, tokenConnection } from './math';
import { isGMState } from './userState';

export type FullToken = Token & {
  name: string;
  shape: FigureShape | MarkerShape;
  scale: Scale;
  label: string;
};

// type CanDie = {
//   dead?: boolean;
// };

// type CanHide = {
//   hidden: boolean;
// };

// type CanColor = {
//   color: Color;
// };

// type CanPlace = {
//   position: Point | null;
//   facing: number | null;
// };

// type CanSize = {
//   scale: number;
// };

// type CanSubordinateTo = {
//   subordinateTo?: GeneratorID;
// };

// type PlacedToken = Token & CanPlace;

///
// type TokenAura = { color: Color | null; radius: number };
// type CircleAura = { shape: 'circle'; radius: number };
// type RectangleAura = { shape: 'rectangle'; width: number; height: number };
// type SquareAura = { shape: 'square'; side: number };
// type Aura = CircleAura | RectangleAura | SquareAura;
///

export const selectedTokenIdState = atom<TokenID | null>({
  key: 'SelectedTokenId',
  default: null,
});

export const hoveredTokenIdState = atom<TokenID | null>({
  key: 'HoveredTokenId',
  default: null,
});

export const tokenIDsState = atom<TokenID[]>({
  key: 'TokenIDs',
  default: selector<TokenID[]>({
    key: 'TokenIDs/Default',
    get: () => api.getTokens(),
  }),
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const subscription = api.tokenListChanges.subscribe((ids) => setSelf(ids));

      return () => subscription.unsubscribe();
    },
  ],
});

export const tokenState = atomFamily<Token, TokenID>({
  key: 'TokenState',
  default: selectorFamily<Token, TokenID>({
    key: 'TokenState/Default',
    get: (id: TokenID) => async () => api.getToken(id),
  }),
  effects_UNSTABLE: (id) => [
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

      const token = get(tokenState(id));

      if (!token) throw Error(`Invalid Token '${id}'`);

      const index = get(tokenIndexState(id));

      const baseDefault = get(baseDefaultState);
      const { name, shape } = get(generatorState(token.generator))!;

      const scale = ('baseSize' in shape ? shape.baseSize : baseDefault) / baseDefault;

      const label = shape.type === 'figure' ? `${shape.label}${shape.isGroup ? index + 1 : index || ''}` : '';

      const { visible = true, deleted = false, active = true, facing, shape: shapeOverrides = {}, ...restToken } = token;

      return {
        ...restToken,
        name,
        label,
        facing: hasFacing ? facing : null,
        shape: { ...shape, ...shapeOverrides },
        visible,
        deleted,
        active,
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

export const tokenMeasurementsState = selector<
  Record<TokenID, Record<TokenID, { distance: number; canSeeTarget: boolean; canSeeOrigin: boolean }>>
>({
  key: 'TokenMeasurements',
  get: ({ get }) => {
    const placements = get(tokenPlacementsState);

    const mapTo = (origin: Placement, target: Placement) => {
      const distance = centerToCenterNormalizedCellDistance(origin, target);
      const [canSeeTarget, canSeeOrigin] = tokenConnection(origin, target);

      return { distance, canSeeTarget, canSeeOrigin };
    };

    return Object.fromEntries(
      placements.map(([originID, originPlacement]) => [
        originID,
        Object.fromEntries(placements.map(([targetID, targetPlacement]) => [targetID, mapTo(originPlacement, targetPlacement)])),
      ])
    );
  },
});

export const activeTokenIDsState = selector<TokenID[]>({
  key: 'ActiveTokenIDs',
  get: ({ get }) =>
    get(tokenIDsState).filter((id) => {
      const { position, deleted = false, active = true } = get(tokenState(id));
      const isVisible = get(isTokenVisibleState(id));
      const viewInactive = get(viewInactiveState);

      return !!position && !deleted && isVisible && (active || viewInactive);
    }),
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
      const { visible = true, generator } = get(tokenState(tokenID));
      const controlledGeneratorList = get(controlledGeneratorListState);

      return !!visible || controlledGeneratorList.includes(generator);
    },
});
