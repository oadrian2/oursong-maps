import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectEncounter } from './mapSlice';

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

export default slice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById, selectIds: selectTokenIds } = adapter.getSelectors(
  (state) => state.tokens
);

export const selectStashedTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !t.position && !t.deleted));
export const selectActiveTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !!t.position && !t.deleted));

export const selectIndexWithinGroup = createSelector(
  [selectAllTokens, (state, { id, group }) => ({ id, group })],
  (tokens, { id, group }) => tokens.filter((t) => t.group === group).findIndex((t) => t.id === id)
);
