// import { PublicClientApplication } from '@azure/msal-browser';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { configureStore } from '@reduxjs/toolkit';
import map from '../map/mapSlice';
import tokens from '../map/tokenSlice';
import ruler from '../ruler/rulerSlice';
import generators from '../supply/generatorsSlice';
import selection from '../map/selectionSlice';
import { addListeners, signalRMiddleware } from './addListeners';

// async function login() {
//   const msalConfig = {
//     auth: {
//       clientId: '853567cf-2063-4017-ad06-b3f52839177c',
//       authority: 'https://login.microsoftonline.com/common',
//       redirectUri: 'http://localhost:3000',
//     },
//     cache: {
//       cacheLocation: 'sessionStorage',
//       storeAuthStateInCookie: false,
//     },
//   };

//   const msal = new PublicClientApplication(msalConfig);

//   console.log(msal.getAllAccounts());

//   const request = {
//     scopes: ['openid', 'profile', 'api://853567cf-2063-4017-ad06-b3f52839177c/user_impersonation'],
//     account: { username: 'orion.adrian@oursong.info' }
//   };

//   const result = await msal.acquireTokenSilent(request).catch(() => msal.acquireTokenPopup(request));

//   return result.accessToken;
// }

const login = () => null;

const connection = new HubConnectionBuilder()
  .withUrl(process.env.REACT_APP_HUB_URL, { accessTokenFactory: login })
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Debug)
  .build();

const store = configureStore({
  reducer: { ruler, generators, tokens, map, selection },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: connection.invoke.bind(connection),
      },
    }).concat(signalRMiddleware(connection)),
});

addListeners(connection, store);

export default store;
