import { configureStore } from '@reduxjs/toolkit';
import tokenGroupsReducer from '../supply/tokenGroupSlice';
import measurementReducer from '../measurement/measurementSlice';
import tokenReducer from '../map/tokenSlice';
import connectionReducer from '../connection/connectionSlice';
import mapReducer from '../map/mapSlice';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { addListeners, signalRMiddleware } from './addListeners';

const connection = new HubConnectionBuilder()
  .configureLogging(LogLevel.Debug)
  .withUrl(process.env.REACT_APP_HUB_URL)
  .build();

const store = configureStore({
  reducer: {
    measurements: measurementReducer,
    tokenGroups: tokenGroupsReducer,
    tokens: tokenReducer,
    connection: connectionReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: connection.invoke.bind(connection),
      },
    }).concat(signalRMiddleware(connection)),
});

addListeners(connection, store);

export default store;
