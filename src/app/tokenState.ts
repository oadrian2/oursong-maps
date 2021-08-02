import { atom, atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';
import { api } from '../api/ws';
import { Generator, GeneratorID, generatorState } from './mapState';
import { Point } from './math';
import { Color } from './state';

export type TokenID = string;

export type Token = {
  generator: string;
  position: Point | null;
  deleted?: boolean;
  visible?: boolean;
  active?: boolean;
  facing?: number | null;
  path?: Point[] | null;
  color?: Color;
};

type FullToken = Token & {
  shape: Generator['shape'];
  shapeType: Generator['shapeType'];
};

type CanDie = {
  dead?: boolean;
};

type CanHide = {
  hidden?: boolean;
};

type CanColor = {
  color?: Color;
};

type CanPlace = {
  position: Point | null;
  facing: number | null;
};

type CanSize = {
  scale: number;
};

type CanSubordinateTo = {
  subordinateTo?: GeneratorID;
};

type PlacedToken = Token & CanPlace;

///
type TokenAura = { color: Color | null; radius: number };
type CircleAura = { shape: 'circle'; radius: number };
type RectangleAura = { shape: 'rectangle'; width: number; height: number };
type SquareAura = { shape: 'square'; side: number };
type Aura = CircleAura | RectangleAura | SquareAura;
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

///
export const tokenState = atomFamily<Token, TokenID>({
  key: 'TokenState',
  default: selectorFamily<Token, TokenID>({
    key: 'TokenState/Default',
    get: (id: TokenID) => () => api.getToken(id),
  }),
  effects_UNSTABLE: (id) => [
    ({ onSet, setSelf }) => {
      const subscription = api.tokenChanges.subscribe(([tokenID, token]) => tokenID === id && setSelf(token));

      onSet((token, oldToken) => token !== oldToken && api.updateToken(id, token));

      return () => subscription.unsubscribe();
    },
  ],
});

export const fullTokenState = selectorFamily<FullToken | null, TokenID | null>({
  key: 'FullToken',
  get:
    (id: TokenID | null) =>
    ({ get }) => {
      if (!id) return null;

      const token = get(tokenState(id));

      if (!token) return null;

      const { shape, shapeType } = get(generatorState(token.generator))!;

      return { ...token, shape, shapeType };
    },
});

export const activeTokenIDsState = selector<TokenID[]>({
  key: 'ActiveTokenIDs',
  get: ({ get }) =>
    get(tokenIDsState).filter((id) => {
      const { position, deleted = false } = get(tokenState(id));

      return !!position && !deleted;
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

export const hoveredTokenPositionState = selector<Point | null>({
  key: 'HoveredTokenPosition',
  get: ({ get }) => { 
    const id = get(hoveredTokenIdState);

    if (id === null) return null;

    const { position } = get(tokenState(id)); 

    return position;
  }
})

export const tokenPosition = selectorFamily<Point | null, TokenID>({
  key: 'TokenPosition',
  get:
    (id: TokenID) =>
    ({ get }) => {
      const token = get(tokenState(id));

      if (token === null) return null;

      return token.position;
    },
  set:
    (id: TokenID) =>
    ({ get, set }, newValue) => {
      const token = get(tokenState(id));

      if (token === null) return;

      const position = newValue instanceof DefaultValue ? null : newValue;

      set(tokenState(id), { ...token, position });
    },
});
