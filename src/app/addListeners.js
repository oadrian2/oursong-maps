import { tokenCreated, tokenUpsert } from '../doodads/tokenSlice';
import { connecting, connected } from '../connection/connectionSlice';

export async function addListeners(connection, { dispatch, getState }) {
  connection.on('newMessage', (token) => {
    console.log(getState());
    console.log('msg!', token);

    dispatch(tokenCreated(token));
  });

  connection.on('worldState', (state) => {
    console.log('worldState');
  });

  connection.on('tokenUpsert', (state) => {
    dispatch(tokenUpsert(state));
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
