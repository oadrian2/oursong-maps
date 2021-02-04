import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectMapId } from '../map/mapSlice';

const adapter = createEntityAdapter({
  sortComparer: ({ prefix: prefixA, allegiance: allegianceA }, { prefix: prefixB, allegiance: allegianceB }) =>
    allegianceA.localeCompare(allegianceB) || prefixA.length - prefixB.length || prefixA.localeCompare(prefixB),
});

const initialState = adapter.getInitialState({ intitialAdded: false });

const slice = createSlice({
  name: 'generators',
  initialState,
  reducers: {
    generatorCreated: adapter.addOne,
    generatorTrashed: adapter.removeOne,
    generatorUpdated: adapter.upsertMany,
    generatorsClaimed(state, action) {
      adapter.updateMany(
        state,
        state.ids.map((id) => ({ id, changes: { claimed: action.payload.includes(id) } }))
      );
    },
  },
});

export const { generatorCreated, generatorTrashed, generatorUpdated, generatorsClaimed } = slice.actions;

export const generatorUpdateRequested = (generator) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  invoke('updateGenerator', mapId, { generator });
};

export default slice.reducer;

export const { selectIds: selectGeneratorIds, selectById: selectGeneratorById, selectAll: selectAllGenerators } = adapter.getSelectors(
  (state) => state.generators
);

export const selectClaimedGeneratorIds = createSelector(selectAllGenerators, (generators) =>
  generators.filter(({ claimed }) => claimed).map(({ id }) => id)
);

export const selectGeneratorsByAllegiance = createSelector(selectAllGenerators, (generators) =>
  generators.reduce((result, g) => {
    result[g.allegiance] = [...(result[g.allegiance] || []), g.id];

    return result;
  }, {})
);
