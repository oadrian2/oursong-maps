// import { PublicClientApplication } from '@azure/msal-browser';
import { HubConnection } from '@microsoft/signalr';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api/ws';
import map from '../map/mapSlice';
import tokens from '../map/tokenSlice';
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

const connection = api.connection;

const store = configureStore({
  reducer: { tokens, map },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: (methodName: string, ...args: any[]) => connection.invoke(methodName, ...args),
      },
    }).concat(signalRMiddleware(connection)),
});

addListeners(api, store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Invoke = HubConnection['invoke'];

export default store;
