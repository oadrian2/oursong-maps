import { throttle } from 'lodash';
import { AtomEffect, atomFamily, selector } from 'recoil';
import { filter } from 'rxjs';
import { api } from '../api/ws';
import { Point } from './math';
import { TokenID } from './tokenState';
import { UserID, userIdState } from './userState';

///

export type Ruler = {
  origin: Point | null;
  points: Point[];
  attached: TokenID | null;
};

///

const rulerSyncEffect: (param: string) => AtomEffect<Ruler> =
  (userID: string) =>
  ({ setSelf, onSet }: any) => {
    const subscription = api.rulerChanges
      .pipe(filter(([incomingUserID]) => userID === incomingUserID))
      .subscribe(([_, ruler]) => setSelf(ruler));

    onSet(throttle((ruler: Ruler) => api.updateRuler(userID, ruler), 200));

    return () => subscription.unsubscribe();
  };

///

export const rulerState = atomFamily<Ruler, UserID>({
  key: 'RulerState',
  default: {
    origin: null,
    points: [],
    attached: null,
  },
  effects_UNSTABLE: (userID) => [rulerSyncEffect(userID)],
});

export const selfRulerState = selector<Ruler>({
  key: 'SelfRulerState',
  get: ({ get }) => get(rulerState(get(userIdState))),
  set: ({ get, set }, newValue) => set(rulerState(get(userIdState)), newValue),
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});
