import { throttle } from 'lodash';
import { AtomEffect, atomFamily, selector, selectorFamily } from 'recoil';
import { combineLatest, filter, map, pairwise, startWith } from 'rxjs';
import { Ruler, UserID } from '../api/types';
import { api } from '../api/ws';
import { isTokenVisibleState } from './tokenState';
import { userIdState } from './userState';

///

const DEFAULT_RULER: Ruler = {
  origin: null,
  points: [],
  attached: null,
  when: new Date(0),
};

const rulerSyncEffect: (param: string) => AtomEffect<Ruler> =
  (userID: string) =>
  ({ setSelf, onSet, getPromise }) => {
    const subscription = combineLatest([api.rulerChanges, getPromise(userIdState)])
      .pipe(
        filter(([[incomingUserID], selfID]) => userID !== selfID && userID === incomingUserID),
        map(([ruler, _]) => ruler),
        startWith([userID, DEFAULT_RULER] as [UserID, Ruler]),
        pairwise(),
        filter(([[_, { when: whenFirst }], [__, { when: whenSecond }]]) => whenSecond > whenFirst),
        map(([_, [__, ruler]]) => ruler)
      )
      .subscribe(function (value) {
        setSelf(value);
      });

    onSet(throttle((ruler: Ruler) => api.updateRuler({ ...ruler, when: new Date() }), 200));

    return () => subscription.unsubscribe();
  };

///

export const rulerState = atomFamily<Ruler, UserID>({
  key: 'RulerState',
  default: DEFAULT_RULER,
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

export const visibleRulerState = selectorFamily<Ruler, UserID>({
  key: 'VisibleRulerState',
  get:
    (userID: UserID) =>
    ({ get }) => {
      const ruler = get(rulerState(userID));

      if (!ruler.attached) {
        return ruler;
      }

      const isTokenVisible = get(isTokenVisibleState(ruler.attached));

      if (isTokenVisible) {
        return ruler;
      }

      return DEFAULT_RULER;
    },
});

export const isSelfMovingState = selector<boolean>({
  key: 'IsSelfMovingState',
  get: ({ get }) => !!get(selfRulerState).attached,
});
