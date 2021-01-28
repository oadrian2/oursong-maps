import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter({
  sortComparer: ({ prefix: prefixA, allegiance: allegianceA }, { prefix: prefixB, allegiance: allegianceB }) =>
    allegianceA.localeCompare(allegianceB) || prefixA.length - prefixB.length || prefixA.localeCompare(prefixB),
});

const initialState = adapter.getInitialState({ intitialAdded: false });

const slice = createSlice({
  name: 'tokenGroups',
  initialState,
  reducers: {
    tokenGroupCreated: adapter.addOne,
    tokenGroupTrashed: adapter.removeOne,
    tokenGroupsUpdated: adapter.upsertMany,
    generatorsClaimed(state, action) {
      adapter.updateMany(
        state,
        state.ids.map((id) => ({ id, changes: { claimed: action.payload.includes(id) } }))
      );
    },
  },
});

export const { tokenGroupCreated, tokenGroupTrashed, tokenGroupsUpdated, generatorsClaimed } = slice.actions;

export const tokenGroupUpdateRequested = (tokenGroup) => (dispatch, getState, invoke) => {
  invoke('UpdateGenerator', 123, { generator: tokenGroup });
};

export default slice.reducer;

export const {
  selectIds: selectGeneratorIds,
  selectById: selectGeneratorById,
  selectAll: selectAllGenerators,
} = adapter.getSelectors((state) => state.tokenGroups);

export const selectClaimedGeneratorIds = createSelector(selectAllGenerators, (generators) =>
  generators.filter(({ claimed }) => claimed).map(({ id }) => id)
);

export const selectGeneratorsByAllegiance = createSelector(selectAllGenerators, (generators) =>
  generators.reduce((result, g) => {
    result[g.allegiance] = [...(result[g.allegiance] || []), g.id];

    return result;
  }, {})
);
