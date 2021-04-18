import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { originSuggested, pathStarted, pathStopped } from '../ruler/rulerSlice';
import { selectGeneratorById } from '../supply/generatorsSlice';
import { selectMapId } from './mapSlice';

export const TokenAllegiance = {
  ALLY: 'ally',
  ENEMY: 'enemy',
  TARGET: 'target',
  UNKNOWN: 'unknown',
};

const adapter = createEntityAdapter({
  baseSize: { default: 30, unit: 'mm', options: [30, 40, 50] },
});

const initialState = adapter.getInitialState();

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

      state.entities[id].position = position;
    },
    tokenStashed: (state, action) => {
      const { id } = action.payload;

      state.entities[id].position = null;
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
    [pathStarted]: (state) => {
      state.moving = state.active;
    },
    [pathStopped]: (state) => {
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

function atMidpoint({ x, y }) {
  return { x: x + TOKEN_MIDPOINT, y: y + TOKEN_MIDPOINT };
}

export const tokenPlacementRequested = (token) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  const midpointPosition = atMidpoint(token.position);

  invoke('updateToken', mapId, { ...token, position: midpointPosition, game: mapId.game, map: mapId.id, path: null });
};

export const stashTokenRequested = ({ id }) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  invoke('updateToken', mapId, { id, position: null });
};

export const moveTokenToRequested = ({ id, position, angle, path }) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  invoke('updateToken', mapId, { id, position, angle, path });
};

export const unstashTokenToRequested = ({ id, position }) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  const midpointPosition = atMidpoint(position);

  invoke('updateToken', mapId, { id, position: midpointPosition, path: null });
};

export const trashTokenRequested = ({ id }) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  invoke('updateToken', mapId, { id, deleted: true });
};

export const tokenEntered = (id) => (dispatch, getState, invoke) => {
  const { position } = selectTokenById(getState(), id);

  dispatch(tokenActivated(id));
  dispatch(originSuggested(position));
};

export const tokenLeft = (id) => (dispatch, getState, invoke) => {
  dispatch(tokenDeactivated(id));
  dispatch(originSuggested(null));
};

export default slice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById, selectIds: selectTokenIds } = adapter.getSelectors(
  (state) => state.tokens
);

export const selectStashedTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !t.position && !t.deleted));
export const selectActiveTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !!t.position && !t.deleted));

export const selectIndexWithinGroup = createSelector(
  [selectAllTokens, (_, { id, generator }) => ({ id, generator })],
  (tokens, { id, generator }) => tokens.filter((t) => t.generator === generator).findIndex((t) => t.id === id)
);

export const selectPositions = createSelector(selectAllTokens, (tokens) => tokens.map(({ id, position }) => ({ id, position })));

export const selectMapBaseSize = (state) => state.tokens.baseSize;

export const selectMenuTokenId = createSelector(
  (state) => state.tokens.active,
  (state) => !!state.tokens.moving,
  (active, moving) => !moving && active
);

export const selectTokenShapeById = createSelector(
  (state, id) => {
    if (!id) return null;

    const token = selectTokenById(state, id);
    const generator = selectGeneratorById(state, token.generator);
    const index = selectIndexWithinGroup(state, { id, generator: token.generator });

    const { position } = token;
    const { shape, shapeType } = generator;

    return { index, position, shape, shapeType };
  },
  (result) => result
);
