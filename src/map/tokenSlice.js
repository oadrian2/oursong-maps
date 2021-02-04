import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectEncounter } from './mapSlice';

export const TokenAllegiance = {
  ALLY: 'ally',
  ENEMY: 'enemy',
  UNKNOWN: 'unknown',
};

const adapter = createEntityAdapter();

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
  },
});

export const { tokenCreated, tokenTrashed, tokenMoved, tokenStashed, tokenUnstashed, tokenUpsert, tokensUpdated } = slice.actions;

export const tokenPlacementRequested = (token) => (dispatch, getState, invoke) => {
  const state = getState();
  const encounter = selectEncounter(state);

  invoke('updateToken', encounter, { ...token, map: encounter });
};

export const stashTokenRequested = ({ id }) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());

  invoke('updateToken', encounter, { id, position: null });
};

export const moveTokenToRequested = ({ id, position }) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());

  invoke('updateToken', encounter, { id, position });
}

export const unstashTokenToRequested = ({ id, position }) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());

  invoke('updateToken', encounter, { id, position });
}

export const trashTokenRequested = ({ id }) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());

  invoke('updateToken', encounter, { id, deleted: true });
};

export default slice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById, selectIds: selectTokenIds } = adapter.getSelectors(
  (state) => state.tokens
);

export const selectStashedTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !t.position && !t.deleted));
export const selectActiveTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !!t.position && !t.deleted));

export const selectIndexWithinGroup = createSelector(
  [selectAllTokens, (state, { id, generator }) => ({ id, generator })],
  (tokens, { id, generator }) => tokens.filter((t) => t.generator === generator).findIndex((t) => t.id === id)
);
