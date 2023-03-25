import { string } from '@recoiljs/refine';
import { atom, errorSelector } from 'recoil';
import { syncEffect } from 'recoil-sync';

export const routedGameKeyState = atom<string>({
  key: 'RoutedGame',
  default: errorSelector(`Value for 'game' missing in route.`),
  effects: [syncEffect({ refine: string(), itemKey: 'game', storeKey: 'context' })],
});

export const routedMapKeyState = atom<string>({
  key: 'RoutedMap',
  default: errorSelector(`Value for 'map' missing in route.`),
  effects: [syncEffect({ refine: string(), itemKey: 'map', storeKey: 'context' })],
});
