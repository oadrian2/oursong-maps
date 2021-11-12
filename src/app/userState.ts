import { atom, AtomEffect } from 'recoil';
import { UserID } from '../api/types';
import { api } from '../api/ws';

///

const userListSyncEffect: AtomEffect<UserID[]> = ({ setSelf }) => {
  const setUserList = (ids: UserID[]) => {
    return setSelf(ids);
  };

  api.onUserListUpdated(setUserList);

  return () => api.offUserListUpdated(setUserList);
};

export const userListState = atom<UserID[]>({
  key: 'UserList',
  default: [],
  effects_UNSTABLE: [userListSyncEffect],
});
const userSyncEffect: AtomEffect<UserID> = ({ trigger, setSelf }) => {
  if (trigger === 'get') {
    setSelf(api.connection.connectionId!);
  }

  api.onConnected((userID) => setSelf(userID));
};

export const userIdState = atom<UserID>({
  key: 'UserId',
  default: api.userId!,
  effects_UNSTABLE: [userSyncEffect],
});
