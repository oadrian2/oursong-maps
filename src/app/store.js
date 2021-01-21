import { configureStore } from '@reduxjs/toolkit';
import tokenGroupsReducer from '../supply/tokenGroupSlice';
import measurementReducer from '../measurement/measurementSlice';
import tokenReducer from '../doodads/tokenSlice';
import connectionReducer from '../connection/connectionSlice';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { addListeners } from './addListeners';

const connection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Debug)
  .withUrl('https://mapofwonders.azurewebsites.net/api')
  .build();

const store = configureStore({
  reducer: {
    measurements: measurementReducer,
    tokenGroups: tokenGroupsReducer,
    tokens: tokenReducer,
    connection: connectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: connection.invoke.bind(connection),
      },
    }),
});

addListeners(connection, store);

export default store;
