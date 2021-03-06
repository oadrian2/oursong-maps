import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { selectMapId } from '../map/mapSlice';

const adapter = createEntityAdapter({
  sortComparer: (
    { shapeType: shapeTypeA, shape: { prefix: prefixA, allegiance: allegianceA, isGroup: isGroupA, color: colorA } },
    { shapeType: shapeTypeB, shape: { prefix: prefixB, allegiance: allegianceB, isGroup: isGroupB, color: colorB } }
  ) =>
    shapeTypeA.localeCompare(shapeTypeB) ||
    (shapeTypeA === 'figure' && (allegianceA.localeCompare(allegianceB) || isGroupA - isGroupB || prefixA.localeCompare(prefixB))) ||
    (shapeTypeA === 'marker' && colorA.localeCompare(colorB)),
});

const initialState = adapter.getInitialState();

const slice = createSlice({
  name: 'generators',
  initialState,
  reducers: {
    generatorCreated: adapter.addOne,
    generatorUpdated: adapter.upsertMany,
    generatorsClaimed(state, action) {
      adapter.updateMany(
        state,
        state.ids.map((id) => ({ id, changes: { claimed: action.payload.includes(id) } }))
      );
    },
  },
});

export const { generatorCreated, generatorUpdated, generatorsClaimed } = slice.actions;

export const generatorUpdateRequested = (generator) => (dispatch, getState, invoke) => {
  const mapId = selectMapId(getState());

  invoke('updateGenerator', mapId, { generator });
};

export default slice.reducer;

export const { selectIds: selectGeneratorIds, selectById: selectGeneratorById, selectAll: selectAllGenerators } = adapter.getSelectors(
  (state) => state.generators
);

export const selectFigureGenerators = createSelector(selectAllGenerators, (generators) =>
  generators.filter(({ shapeType }) => shapeType === 'figure')
);

export const selectMarkerGenerators = createSelector(selectAllGenerators, (generators) =>
  generators.filter(({ shapeType }) => shapeType === 'marker')
);

export const selectFigureGeneratorIds = createSelector(selectFigureGenerators, (generators) => generators.map(({ id }) => id));

export const selectMarkerGeneratorIds = createSelector(selectMarkerGenerators, (generators) => generators.map(({ id }) => id));

export const selectClaimedGeneratorIds = createSelector(selectFigureGenerators, (generators) =>
  generators.filter(({ claimed }) => claimed).map(({ id }) => id)
);

export const selectGeneratorsByAllegiance = createSelector(selectFigureGenerators, (generators) =>
  generators.reduce((result, { id, shapeType, shape: { allegiance } }) => {
    if (shapeType !== 'figure') return result;

    result[allegiance] = [...(result[allegiance] || []), id];

    return result;
  }, {})
);
