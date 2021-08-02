import { HubConnection } from '@microsoft/signalr';
import { MapApi } from '../api/ws';
import { connected, connecting, mapLoaded, selectLoaded, selectMapId } from '../map/mapSlice';
import { tokensUpdated, tokenUpsert } from '../map/tokenSlice';

export async function addListeners(api: MapApi, { dispatch, getState }: any) {
  api.connection.on('newMessage', (message) => {
    dispatch(message);
  });

  api.connection.on('worldState', (state) => {
    console.log('worldState', state);

    const isLoaded = selectLoaded(getState());

    if (isLoaded) return;

    const { id, game, tokens } = state;

    dispatch(tokensUpdated(tokens));
    dispatch(mapLoaded({ id, game }));
  });

  api.connection.on('tokenUpdated', (mapId, token) => {
    const { id: currentMap } = selectMapId(getState());

    if (currentMap !== mapId.id) return;

    dispatch(tokenUpsert(token));
  });

  api.connection.onreconnecting(() => {
    dispatch(connecting());
  });

  api.connection.onreconnected((connectionId?: string) => {
    dispatch(connected(connectionId));
  });

  await api.connect();

  dispatch(connected(api.connection.connectionId));
}

export const signalRMiddleware = (connection: HubConnection) => {
  return (store: any) => {
    connection.on('broadcastReceived', (action) => {
      store.dispatch(action);
    });

    return (next: any) => (action: any) => {
      if (action.type === 'broadcast') {
        console.log('broadcasting', action.payload);
        connection.invoke('broadcast', action.payload);

        return;
      }

      return next(action);
    };
  };
};
