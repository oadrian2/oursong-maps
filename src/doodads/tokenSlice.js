import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectEncounter } from '../map/mapSlice';

const tokensAdapter = createEntityAdapter();

const initialState = tokensAdapter.getInitialState();

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    tokenCreated: tokensAdapter.addOne,
    tokenTrashed: tokensAdapter.removeOne,
    tokenUpsert: tokensAdapter.upsertOne,
    tokensUpdated: tokensAdapter.upsertMany,
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

export const { tokenCreated, tokenTrashed, tokenMoved, tokenStashed, tokenUnstashed, tokenUpsert, tokensUpdated } = tokenSlice.actions;

export const tokenPlacementRequested = (token) => (dispatch, getState, invoke) => {
  const state = getState();
  const encounter = selectEncounter(state);

  invoke('events', encounter, token);
};

export const tokenUpsertRequested = (token) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());

  invoke('events', encounter, token);
};

export const tokenStashRequested = (id) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());
  const token = selectTokenById(getState(), id);

  invoke('events', encounter, { ...token, position: null });
};

export const tokenTrashRequested = (id) => (dispatch, getState, invoke) => {
  const encounter = selectEncounter(getState());
  const token = selectTokenById(getState(), id);

  invoke('events', encounter, { ...token, deleted: true });
};

export default tokenSlice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById, selectIds: selectTokenIds } = tokensAdapter.getSelectors(
  (state) => state.tokens
);

export const selectStashedTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !t.position && !t.deleted));
export const selectActiveTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !!t.position && !t.deleted));

export const selectAllTokenIdGroupPairs = createSelector(selectAllTokens, (tokens) => tokens.map(({ id, group }) => ({ id, group })));

export const selectIndexWithinGroup = createSelector(
  [selectAllTokenIdGroupPairs, (state, { id, group }) => ({ id, group })],
  (tokens, { id, group }) => tokens.filter((t) => t.group === group).findIndex((t) => t.id === id)
);
