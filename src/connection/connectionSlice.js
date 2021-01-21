import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'connection',
  initialState: {
    connected: false,
  },
  reducers: {
    connecting: (state) => {
      state.connected = false;
    },
    connected: (state) => {
      state.connected = true;
    },
  },
});

export const selectConnected = state => state.connection.connected;

export const { connecting, connected } = slice.actions;

export default slice.reducer;
