import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

const tokenGroupsAdapter = createEntityAdapter({
  sortComparer: ({ prefix: prefixA, allegiance: allegianceA }, { prefix: prefixB, allegiance: allegianceB }) =>
    allegianceA.localeCompare(allegianceB) || prefixA.length - prefixB.length || prefixA.localeCompare(prefixB),
});

const initialState = tokenGroupsAdapter.getInitialState({ intitialAdded: false });

const tokenGroupsSlice = createSlice({
  name: 'tokenGroups',
  initialState,
  reducers: {
    tokenGroupCreated: tokenGroupsAdapter.addOne,
    tokenGroupTrashed: tokenGroupsAdapter.removeOne,
    tokenGroupsUpdated: tokenGroupsAdapter.upsertMany,
    generatorsClaimed(state, action) {
      tokenGroupsAdapter.updateMany(
        state,
        state.ids.map((id) => ({ id, changes: { claimed: action.payload.includes(id) } }))
      );
    },
  },
});

export const { tokenGroupCreated, tokenGroupTrashed, tokenGroupsUpdated, generatorsClaimed } = tokenGroupsSlice.actions;

export const tokenGroupUpdateRequested = (tokenGroup) => (dispatch, getState, invoke) => {
  invoke('UpdateGenerator', 123, { generator: tokenGroup });
};

export default tokenGroupsSlice.reducer;

export const {
  selectIds: selectTokenGroupIds,
  selectById: selectTokenGroupById,
  selectAll: selectAllTokenGroups,
} = tokenGroupsAdapter.getSelectors((state) => state.tokenGroups);

export const selectClaimedGeneratorIds = createSelector(selectAllTokenGroups, (generators) =>
  generators.filter(({ claimed }) => claimed).map(({ id }) => id)
);

export const selectGeneratorsByAllegiance = createSelector(selectAllTokenGroups, (generators) =>
  generators.reduce((result, g) => {
    result[g.allegiance] = [...(result[g.allegiance] || []), g.id];

    return result;
  }, {})
);
