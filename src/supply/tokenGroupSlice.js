import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

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
  },
});

export const { tokenGroupCreated, tokenGroupTrashed, tokenGroupsUpdated } = tokenGroupsSlice.actions;

export const tokenGroupUpdateRequested = (tokenGroup) => (dispatch, getState, invoke) => {
  invoke('UpdateGenerator', 123, { generator: tokenGroup });
};

export default tokenGroupsSlice.reducer;

export const {
  selectIds: selectTokenGroupIds,
  selectById: selectTokenGroupById,
  selectAll: selectAllTokenGroups,
} = tokenGroupsAdapter.getSelectors((state) => state.tokenGroups);
