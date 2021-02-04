import { connected, connecting, mapLoaded, selectEncounter, selectLoaded } from '../map/mapSlice';
import { tokensUpdated, tokenUpsert } from '../map/tokenSlice';
import { generatorUpdated } from '../supply/generatorsSlice';

export async function addListeners(connection, { dispatch, getState }) {
  connection.on('newMessage', (message) => {
    dispatch(message);
  });

  connection.on('worldState', (state) => {
    console.log('worldState', state);

    const isLoaded = selectLoaded(getState());

    if (isLoaded) return;

    const { id, title, gameDate, image, map, generators, tokens } = state;

    dispatch(generatorUpdated(generators));
    dispatch(tokensUpdated(tokens));
    dispatch(mapLoaded({ id, title, gameDate, image, map }));
  });

  connection.on('tokenUpsert', (token, tokenEncounter) => {
    const currentEncounter = selectEncounter(getState());

    if (currentEncounter !== tokenEncounter) return;

    dispatch(tokenUpsert(token));
  });

  connection.on('tokenUpdated', (token) => {
    const currentMap = selectEncounter(getState());

    if (currentMap !== token.map) return;

    dispatch(tokenUpsert(token));
  })

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
