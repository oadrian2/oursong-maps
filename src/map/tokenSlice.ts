import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { Point } from '../app/math';
import { AppDispatch, Invoke, RootState } from '../app/store';
import { pathStarted, pathStopped } from '../ruler/rulerSlice';
import { selectMapId } from './mapSlice';

export enum TokenAllegiance {
  Ally = 'ally',
  Enemy = 'enemy',
  Target = 'target',
  Unknown = 'unknown',
}

export type TokenID = string;

export interface Token {
  id: TokenID;
  generator: string;
  position: Point | null;
  deleted?: boolean;
  visible?: boolean;
  active?: boolean;
  facing?: number;
  path?: Point[];
}

const adapter = createEntityAdapter<Token>();

type TokenState = {
  active: TokenID | null;
  moving: TokenID | null;
  baseSize: {
    default: number;
    unit: 'mm' | 'yd';
    options: number[];
  };
};

const initialState = adapter.getInitialState<TokenState>({
  active: null,
  moving: null,
  baseSize: { default: 30, unit: 'mm', options: [30, 40, 50] },
});

const slice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    tokenCreated: adapter.addOne,
    tokenTrashed: adapter.removeOne,
    tokenUpsert: adapter.upsertOne,
    tokensUpdated: adapter.upsertMany,
    tokenMoved: (state, action) => {
      const { id, position } = action.payload;

      state.entities[id]!.position = position;
    },
    tokenStashed: (state, action) => {
      const { id } = action.payload;

      state.entities[id]!.position = null;
    },
    tokenUnstashed: (state, action) => {
      const { id, position } = action.payload;

      state.entities[id] = position;
    },
    tokenActivated: (state, action) => {
      state.active = action.payload;
    },
    tokenDeactivated: (state) => {
      state.active = null;
    },
  },
  extraReducers: {
    [pathStarted.type]: (state) => {
      state.moving = state.active;
    },
    [pathStopped.type]: (state) => {
      state.moving = null;
    },
  },
});

export const {
  tokenCreated,
  tokenTrashed,
  tokenMoved,
  tokenStashed,
  tokenUnstashed,
  tokenUpsert,
  tokensUpdated,
  tokenActivated,
  tokenDeactivated,
} = slice.actions;

const TOKEN_SIZE = 48.0;
const TOKEN_MIDPOINT = TOKEN_SIZE / 2;

function atMidpoint({ x, y }: Point) {
  return { x: x + TOKEN_MIDPOINT, y: y + TOKEN_MIDPOINT };
}

export const tokenPlacementRequested = (token: Token) => (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
  const mapId = selectMapId(getState());

  const midpointPosition = atMidpoint(token.position!);

  invoke('updateToken', mapId, { ...token, position: midpointPosition, game: mapId.game, map: mapId.id, path: null });
};

export const toggleTokenVisibilityRequested =
  ({ id, visible }: { id: TokenID; visible: boolean }) =>
  (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
    const mapId = selectMapId(getState());

    invoke('updateToken', mapId, { id, visible, path: null });
  };

export const stashTokenRequested =
  ({ id }: { id: TokenID }) =>
  (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
    const mapId = selectMapId(getState());

    invoke('updateToken', mapId, { id, position: null, path: null });
  };

export const moveTokenToRequested =
  ({ id, position, facing, path }: { id: TokenID; position: Point; facing: number; path: Point[] }) =>
  (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
    const mapId = selectMapId(getState());

    invoke('updateToken', mapId, { id, position, facing, path });
  };

export const unstashTokenToRequested =
  ({ id, position }: { id: TokenID; position: Point }) =>
  (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
    const mapId = selectMapId(getState());

    const midpointPosition = atMidpoint(position);

    invoke('updateToken', mapId, { id, position: midpointPosition, path: null });
  };

export const trashTokenRequested =
  ({ id }: { id: TokenID }) =>
  (dispatch: AppDispatch, getState: () => RootState, invoke: Invoke) => {
    const mapId = selectMapId(getState());

    invoke('updateToken', mapId, { id, deleted: true });
  };

export default slice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById } = adapter.getSelectors((state: RootState) => state.tokens);

export const selectStashedTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !t.position && !t.deleted));

export const selectIndexWithinGroup = createSelector(
  [selectAllTokens, (state: RootState, { id, generator }: { id: TokenID; generator: string }) => ({ id, generator })],
  (tokens, { id, generator }) => tokens.filter((t) => t.generator === generator).findIndex((t) => t.id === id)
);
