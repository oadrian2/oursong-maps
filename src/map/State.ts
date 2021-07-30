import { throttle } from 'lodash';
import { atom, AtomEffect, atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';
import { filter } from 'rxjs';
import { api } from '../api/ws';
import { Placement, Point } from '../app/math';
import { TokenAllegiance } from './tokenSlice';

export type PartitionedID = { game: string; id: string };
export type LocalID<T> = { id: T };

type Color = 'red' | 'green' | 'blue' | 'yellow';

///

export type UserID = string;

const userListSyncEffect: AtomEffect<UserID[]> = ({ setSelf }) => {
  const setUserList = (ids: UserID[]) => {
    return setSelf(ids);
  };

  api.onUserListUpdated(setUserList);

  return () => api.offUserListUpdated(setUserList);
};

export const userListState = atom<UserID[]>({
  key: 'UserList',
  default: [],
  effects_UNSTABLE: [userListSyncEffect],
});

const userSyncEffect: AtomEffect<UserID> = ({ trigger, setSelf }) => {
  if (trigger === 'get') {
    setSelf(api.connection.connectionId!);
  }

  api.onConnected((userID) => setSelf(userID));
};

export const userIdState = atom<UserID>({
  key: 'UserId',
  default: api.userId!,
  effects_UNSTABLE: [userSyncEffect],
});

///

export type MapID = PartitionedID;

type Map = MapID & {
  title: string;
  map: MapImage;
  generators: Generator[];
};

type MapImage = {
  image: string;
  scale: number;
  width: number;
  height: number;
};

export type GeneratorID = string;

type FigureGenerator = {
  id: GeneratorID;
  // label: string;
  shapeType: 'figure';
  shape: {
    prefix: string;
    label: string; // TODO: move out
    allegiance: TokenAllegiance;
    color?: Color;
    baseSize?: number;
    isGroup?: boolean;
  };
};

type MarkerGenerator = {
  id: GeneratorID;
  // label: string;
  shapeType: 'marker';
  shape: {
    label: string; // TODO: move out
    color: Color;
    baseSize?: number; // @decprecated
  };
};

type Generator = FigureGenerator | MarkerGenerator;

export function isFigureGenerator(g: Generator): g is FigureGenerator {
  return g.shapeType === 'figure';
}
export function isMarkerGenerator(g: Generator): g is MarkerGenerator {
  return g.shapeType === 'marker';
}

export type TokenID = string;

export type Token = {
  generator: string;
  position: Point | null;
  deleted?: boolean;
  visible?: boolean;
  active?: boolean;
  facing?: number;
  path?: Point[];
  color?: Color;
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

///

export type Ruler = {
  origin: Point | null;
  points: Point[];
};

///

const tokenSyncEffect: (id: TokenID | null) => AtomEffect<Token | null> =
  (tokenID: TokenID | null) =>
  ({ setSelf, onSet }: any) => {
    const subscription = api.tokenChanges
      .pipe(filter(([incomingTokenID]) => tokenID === incomingTokenID))
      .subscribe(([_, token]) => setSelf(token));

    // onSet((token: Token) => api.updateToken(tokenID, token));

    return () => subscription.unsubscribe();
  };

export const tokenIDsState = atom<TokenID[]>({
  key: 'TokenIDs',
  default: [],
});

export const tokenState = atomFamily<Token | null, TokenID | null>({
  key: 'TokenState',
  default: null,
  effects_UNSTABLE: (id) => [tokenSyncEffect(id)],
});

export const tokenListState = selector<(Token & LocalID<TokenID>)[]>({
  key: 'TokenList',
  get: ({ get }) => get(tokenIDsState).map((id) => ({ id, ...get(tokenState(id))! })),
  set: ({ get, set, reset }, newTokens) => {
    const newTokenList = newTokens instanceof DefaultValue ? [] : newTokens;

    const oldIDs = get(tokenIDsState);
    const newIDs = newTokenList.map(({ id }) => id);

    set(tokenIDsState, newIDs);

    oldIDs.forEach((id) => reset(tokenState(id)));
    newTokenList.forEach(({ id, ...token }) => set(tokenState(id), token));
  },
});

type FullToken = {
  position: Point | null;
  deleted?: boolean;
  visible?: boolean;
  active?: boolean;
  facing?: number;
  path?: Point[];
  color?: Color;
  generator: GeneratorID;
  shape: Generator['shape'];
  shapeType: Generator['shapeType'];
};

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
      const { position, deleted = false } = get(tokenState(id))!;

      return !!position && !deleted;
    }),
});

export const tokenPosition = selectorFamily<Point | null, TokenID>({
  key: 'TokenPosition',
  get:
    (id: TokenID) =>
    ({ get }) => {
      const token = get(tokenState(id))!;

      return token.position;
    },
  set:
    (id: TokenID) =>
    ({ get, set }, newValue) => {
      const token = get(tokenState(id))!;

      const position = newValue instanceof DefaultValue ? null : newValue;

      set(tokenState(id)!, { ...token, position });
    },
});

export const tokenPlacement = atomFamily<Placement, TokenID>({
  key: 'TokenPlacement',
  // what to do here? Can you have a placement without it being on the map? Is scale necessary?
  default: { position: { x: 0.0, y: 0.0 }, scale: 1.0 },
});

export const tokenVisible = atomFamily<boolean, TokenID>({
  key: 'TokenVisible',
  default: true,
});

export const tokenActive = atomFamily<boolean, TokenID>({
  key: 'TokenActive',
  default: true,
});

export const tokenAura = atomFamily<TokenAura | null, TokenID>({
  key: 'TokenAura',
  default: null,
});

///

const rulerSyncEffect: (param: string) => AtomEffect<Ruler> =
  (userID: string) =>
  ({ setSelf, onSet }: any) => {
    const subscription = api.rulerChanges
      .pipe(filter(([incomingUserID]) => userID === incomingUserID))
      .subscribe(([_, ruler]) => setSelf(ruler));

    onSet(throttle((ruler: Ruler) => api.updateRuler(userID, ruler), 200));

    return () => subscription.unsubscribe();
  };

///
export const rulerState = atomFamily<Ruler, UserID>({
  key: 'RulerState',
  default: {
    origin: null,
    points: [],
  },
  effects_UNSTABLE: (userID) => [rulerSyncEffect(userID)],
});

export const selfRulerState = selector<Ruler>({
  key: 'SelfRulerState',
  get: ({ get }) => get(rulerState(get(userIdState))),
  set: ({ get, set }, newValue) => set(rulerState(get(userIdState)), newValue),
});

export const mapId = atom<PartitionedID | null>({
  key: 'MapID',
  default: null,
});

export const mapState = selector<Map>({
  key: 'MapState',
  get: async ({ get }) => {
    const { game, id } = get(mapId)!;

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}`);

    if (response.status !== 200) throw Error('Augh!');

    return response.json();
  },
});

export const mapTitleState = selector<string>({
  key: 'MapTitle',
  get: ({ get }) => {
    const { title } = get(mapState);

    return title;
  },
});

export const mapGeneratorsState = selector<any[]>({
  key: 'MapGenerators',
  get: ({ get }) => {
    const { generators } = get(mapState);

    return [...generators, ...markerGenerators].sort(sortComparer);
  },
});

export const mapImageState = selector<{ src: string; width: number }>({
  key: 'MapImage',
  get: ({ get }) => {
    const {
      game,
      id,
      map: { image, width, scale },
    } = get(mapState);

    return {
      src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
      width: width * scale,
    };
  },
});

export const mapZoomState = atom<number>({
  key: 'MapZoom',
  default: 1.0,
});

export const viewInactiveState = atom<boolean>({
  key: 'ViewInactiveState',
  default: true,
});

export const generatorListState = selector<GeneratorID[]>({
  key: 'GeneratorList',
  get: ({ get }) => get(mapGeneratorsState).map((g) => g.id),
});

export const figureGeneratorListState = selector<GeneratorID[]>({
  key: 'FigureGeneratorList',
  get: ({ get }) =>
    get(mapGeneratorsState)
      .filter(isFigureGenerator)
      .map((g) => g.id),
});

export const markerGeneratorListState = selector<GeneratorID[]>({
  key: 'MarkerGeneratorList',
  get: ({ get }) =>
    get(mapGeneratorsState)
      .filter(isMarkerGenerator)
      .map((g) => g.id),
});

export const claimedFigureGeneratorListState = atom<GeneratorID[]>({
  key: 'ClaimedFigureGeneratorList',
  default: [],
});

export const controlledGeneratorListState = selector<GeneratorID[]>({
  key: 'ControlledGeneratorList',
  get: ({ get }) => [...get(claimedFigureGeneratorListState), ...get(markerGeneratorListState)],
});

export const isControlledGeneratorState = selectorFamily<boolean, GeneratorID>({
  key: 'IsControlGenerator',
  get:
    (id: GeneratorID) =>
    ({ get }) =>
      get(controlledGeneratorListState).includes(id),
});

export const generatorState = selectorFamily<Generator | null, GeneratorID>({
  key: 'GeneratorState',
  get:
    (id) =>
    ({ get }) =>
      get(mapGeneratorsState).find((g) => g.id === id),
});

export const generatorsByAllegianceState = selector<{ [key in TokenAllegiance]: GeneratorID[] }>({
  key: 'GeneratorsByAllegiance',
  get: ({ get }) => {
    const generators = get(mapGeneratorsState).filter(isFigureGenerator);

    return generators.reduce((result, { id, shape: { allegiance } }) => {
      result[allegiance] = [...(result[allegiance] || []), id];

      return result;
    }, {} as { [key in TokenAllegiance]: GeneratorID[] });
  },
});

const sortComparer = (generatorA: Generator, generatorB: Generator) =>
  generatorA.shapeType.localeCompare(generatorB.shapeType) ||
  +(generatorA.shapeType === 'figure' && generatorB.shapeType === 'figure' && figureComparer(generatorA, generatorB)) ||
  +(generatorA.shapeType === 'marker' && generatorB.shapeType === 'marker' && markerComparer(generatorA, generatorB));

const figureComparer = (
  { shape: { prefix: prefixA, allegiance: allegianceA, isGroup: isGroupA = false } }: FigureGenerator,
  { shape: { prefix: prefixB, allegiance: allegianceB, isGroup: isGroupB = false } }: FigureGenerator
) => allegianceA.localeCompare(allegianceB) || +isGroupA - +isGroupB || prefixA.localeCompare(prefixB);

const markerComparer = ({ shape: { color: colorA } }: MarkerGenerator, { shape: { color: colorB } }: MarkerGenerator) =>
  colorA.localeCompare(colorB);

// TODO: find a better solution
const markerGenerators: MarkerGenerator[] = [
  {
    id: 'marker:red',
    shapeType: 'marker',
    shape: {
      label: 'Red',
      color: 'red',
    },
  },
  {
    id: 'marker:blue',
    shapeType: 'marker',
    shape: {
      label: 'Blue',
      color: 'blue',
    },
  },
  {
    id: 'marker:green',
    shapeType: 'marker',
    shape: {
      label: 'Green',
      color: 'green',
    },
  },
];
