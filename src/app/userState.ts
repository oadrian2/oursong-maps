import { atom, AtomEffect } from 'recoil';
import { UserID } from '../api/types';
import { api } from '../api/ws';

///

const userListSyncEffect: AtomEffect<UserID[]> = ({ setSelf }) => {
  api.onUserListUpdated(setSelf);

  return () => api.offUserListUpdated(setSelf);
};

export const userListState = atom<UserID[]>({
  key: 'UserList',
  default: [],
  effects: [userListSyncEffect],
});

const userSyncEffect: AtomEffect<UserID> = ({ trigger, setSelf }) => {
  if (trigger === 'get') {
    setSelf(api.userId!);
  }

  api.onConnected(setSelf);

  return () => api.offConnected(setSelf);
};

export const userIdState = atom<UserID>({
  key: 'UserId',
  default: api.userId!,
  effects: [userSyncEffect],
});

export const isGMState = atom<boolean>({
  key: 'IsGM',
  default: false,
});
