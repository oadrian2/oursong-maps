import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit';
import { TokenAllegiance } from '../doodads/NameToken';

const standardParty = [
  { id: nanoid(), label: 'Burke', prefix: 'Bu', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
  { id: nanoid(), label: 'Joseph', prefix: 'Jo', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
  { id: nanoid(), label: 'Marlow', prefix: 'Ma', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
  { id: nanoid(), label: 'Mei', prefix: 'Me', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
  { id: nanoid(), label: 'Pepe', prefix: 'Pe', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
  { id: nanoid(), label: 'Red', prefix: 'Re', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
  { id: nanoid(), label: 'Xyllah', prefix: 'Xy', nextIndex: 0, allegiance: TokenAllegiance.ALLY },
];

const tokenGroupsAdapter = createEntityAdapter({ sortComparer: ({ label: labelA }, { label: labelB }) => labelA.localeCompare(labelB) });

const initialState = tokenGroupsAdapter.getInitialState({ intitialAdded: false });

const tokenGroupsSlice = createSlice({
  name: 'tokenGroups',
  initialState,
  reducers: {
    tokenGroupCreated: tokenGroupsAdapter.addOne,
    tokenGroupTrashed: tokenGroupsAdapter.removeOne,
    standardPartyAdded: (state) => {
      if (state.initialAdded) return;

      tokenGroupsAdapter.upsertMany(state, standardParty);

      state.initialAdded = true;
    },
  },
});

export const { tokenGroupCreated, tokenGroupTrashed, standardPartyAdded } = tokenGroupsSlice.actions;

export default tokenGroupsSlice.reducer;

export const {
  selectIds: selectTokenGroupIds,
  selectById: selectTokenGroupById,
  selectAll: selectAllTokenGroups,
} = tokenGroupsAdapter.getSelectors((state) => state.tokenGroups);
