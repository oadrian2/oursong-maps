import { HubConnection } from '@microsoft/signalr';
import { connected, connecting, mapLoaded, selectLoaded, selectMapId } from '../map/mapSlice';
import { tokensUpdated, tokenUpsert } from '../map/tokenSlice';
import { updateRemoteRuler } from '../ruler/rulerSlice';
import { generatorUpdated } from '../supply/generatorsSlice';

const markerGenerators = [
  {
    id: 'marker:red',
    shapeType: 'marker',
    movable: false,
    claimable: false,
    shape: {
      color: 'red',
    },
  },
  {
    id: 'marker:blue',
    shapeType: 'marker',
    movable: false,
    claimable: false,
    shape: {
      color: 'blue',
    },
  },
  {
    id: 'marker:green',
    shapeType: 'marker',
    movable: false,
    claimable: false,
    shape: {
      color: 'green',
    },
  },
];

export async function addListeners(connection: HubConnection, { dispatch, getState }: any) {
  connection.on('newMessage', (message) => {
    dispatch(message);
  });

  connection.on('worldState', (state) => {
    console.log('worldState', state);

    const isLoaded = selectLoaded(getState());

    if (isLoaded) return;

    const { id, game, title, gameDate, image, map, generators, tokens } = state;

    dispatch(generatorUpdated([...generators, ...markerGenerators]));
    dispatch(tokensUpdated(tokens));
    dispatch(mapLoaded({ id, game, title, gameDate, image, map }));
  });

  connection.on('tokenUpdated', (mapId, token) => {
    const { id: currentMap } = selectMapId(getState());

    if (currentMap !== mapId.id) return;

    dispatch(tokenUpsert(token));
  });

  connection.on('rulerUpdated', (mapId, ruler, timestamp) => {
    const { id: currentMap } = selectMapId(getState());

    if (currentMap !== mapId.id) return;

    dispatch(updateRemoteRuler(ruler));
  });

  connection.onreconnecting(() => {
    dispatch(connecting());
  });

  connection.onreconnected(() => {
    dispatch(connected());
  });

  await connection.start();

  dispatch(connected());
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
