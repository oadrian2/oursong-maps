import { atom } from 'recoil';

export type PartitionedID = { game: string; id: string };
export type LocalID<T> = { id: T };

export type Color = 'red' | 'green' | 'blue' | 'yellow';

export const MeasurementStrategy = {
  centerToCenter: 'center-to-center',
  edgeToEdge: 'edge-to-edge',
  centerToCenterNormalized: 'center-to-center-normalized',
};

export const viewInactiveState = atom<boolean>({
  key: 'ViewInactiveState',
  default: true,
});
