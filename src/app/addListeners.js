import { connected, connecting, loaded, mapUpdated, selectEncounter, selectLoaded } from '../map/mapSlice';
import { tokensUpdated, tokenUpsert } from '../map/tokenSlice';
import { tokenGroupsUpdated } from '../supply/generatorsSlice';

export async function addListeners(connection, { dispatch, getState }) {
  connection.on('newMessage', (message) => {
    dispatch(message);
  });

  connection.on('worldState', (state) => {
    console.log('worldState', state);

    const isLoaded = selectLoaded(getState());

    if (isLoaded) return;

    const { id, title, gameDate, image, generators, tokens } = state;

    dispatch(mapUpdated({ id, title, gameDate, image }));
    dispatch(tokenGroupsUpdated(generators));
    dispatch(tokensUpdated(tokens));
    dispatch(loaded());

    console.log(getState());
  });

  connection.on('tokenUpsert', (token, tokenEncounter) => {
    const currentEncounter = selectEncounter(getState());

    if (currentEncounter !== tokenEncounter) return;

    dispatch(tokenUpsert(token));
  });

  connection.on('groupJoined', (state) => {
    console.log(state);
  });

  connection.onclose(() => {
    dispatch(connecting());
  });

  connection.onreconnecting(() => {
    dispatch(connecting());
  });

  connection.onreconnected(() => {
    dispatch(connected());
  });

  dispatch(connecting());

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
        connection.invoke('broadcast', 123, action.payload);

        return;
      }

      return next(action);
    };
  };
};
