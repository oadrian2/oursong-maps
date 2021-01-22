import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {
    encounter: 123,
    title: '',
    ingameDate: '',
    image: '',
    scale: 2.5,
    showGrid: false,
  },
  reducers: {
    showGrid: (state) => {
      state.showGrid = true;
    },
    hideGrid: (state) => {
      state.showGrid = false;
    },
    mapUpdated: (state, action) => {
      const { title, image, ingameDate } = action.payload;

      state.title = title;
      state.image = image;
      state.ingameDate = ingameDate;
    },
  },
});

export const { mapUpdated } = slice.actions;

export default slice.reducer;

export const selectMap = (state) => state.map;

export const selectEncounter = createSelector(selectMap, (map) => map.encounter);
