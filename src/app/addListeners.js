import { connected, connecting } from '../connection/connectionSlice';
import { tokensUpdated, tokenUpsert } from '../doodads/tokenSlice';
import { mapUpdated } from '../map/mapSlice';
import { tokenGroupsUpdated } from '../supply/tokenGroupSlice';

export async function addListeners(connection, { dispatch, getState }) {
  connection.on('newMessage', (message) => {
    dispatch(message);
  });

  connection.on('worldState', (state) => {
    console.log('worldState', state);

    const { title, ingameDate, image, generators, tokens } = state;

    dispatch(mapUpdated({ title, ingameDate, image }));
    dispatch(tokenGroupsUpdated(generators));
    dispatch(tokensUpdated(tokens));

    console.log(getState());
  });

  connection.on('tokenUpsert', (state) => {
    dispatch(tokenUpsert(state));
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

  connection.invoke('groupJoined', 123);

  dispatch(connected());
}
