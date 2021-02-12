import { connected, connecting, mapLoaded, selectLoaded, selectMapId } from '../map/mapSlice';
import { tokensUpdated, tokenUpsert } from '../map/tokenSlice';
import { generatorUpdated } from '../supply/generatorsSlice';
import { updateRemoteRuler } from '../ruler/rulerSlice';

const markerGenerators = [
  {
    id: 'marker:red',
    shapeType: 'marker',
    movable: false,
    claimable: false,
    shape: {
      color: 'red',
    }
  },
  {
    id: 'marker:blue',
    shapeType: 'marker',
    movable: false,
    claimable: false,
    shape: {
      color: 'blue',
    }
  },
  {
    id: 'marker:green',
    shapeType: 'marker',
    movable: false,
    claimable: false,
    shape: {
      color: 'green',
    }
  },
];

export async function addListeners(connection, { dispatch, getState }) {
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

  connection.on('rulerUpdated', (mapId, ruler) => {
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

export const signalRMiddleware = (connection) => {
  return (store) => {
    connection.on('broadcastReceived', (action) => {
      store.dispatch(action);
    });

    return (next) => (action) => {
      if (action.type === 'broadcast') {
        console.log('broadcasting', action.payload);
        connection.invoke('broadcast', action.payload);

        return;
      }

      return next(action);
    };
  };
};
