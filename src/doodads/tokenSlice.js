import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

const tokensAdapter = createEntityAdapter();

const initialState = tokensAdapter.getInitialState();

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    tokenCreated: tokensAdapter.addOne,
    tokenTrashed: tokensAdapter.removeOne,
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
    tokenUpsert: tokensAdapter.upsertOne,
  },
});

export const { tokenCreated, tokenTrashed, tokenMoved, tokenStashed, tokenUnstashed, tokenUpsert } = tokenSlice.actions;

export const tokenPlacementRequested = (token) => (dispatch, getState, invoke) => {
  invoke('events', 123, token);
};

export const tokenUpsertRequested = (token) => (dispatch, getState, invoke) => {
  invoke('events', 123, token);
};

export const tokenStashRequested = (id) => (dispatch, getState, invoke) => {
  const token = selectTokenById(getState(), id);

  invoke('events', 123, { ...token, position: null });
};

export default tokenSlice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById, selectIds: selectTokenIds } = tokensAdapter.getSelectors(
  (state) => state.tokens
);

export const selectStashedTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !t.position));
export const selectActiveTokens = createSelector(selectAllTokens, (tokens) => tokens.filter((t) => !!t.position));
