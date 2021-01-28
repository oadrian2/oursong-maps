import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from '../connection/connectionSlice';
import mapReducer from '../map/mapSlice';
import tokenReducer from '../map/tokenSlice';
import rulerReducer from '../ruler/rulerSlice';
import tokenGroupsReducer from '../supply/generatorsSlice';
import { addListeners, signalRMiddleware } from './addListeners';

const connection = new HubConnectionBuilder().configureLogging(LogLevel.Debug).withUrl(process.env.REACT_APP_HUB_URL).build();

const store = configureStore({
  reducer: {
    ruler: rulerReducer,
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
