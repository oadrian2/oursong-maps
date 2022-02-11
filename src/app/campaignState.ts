import { atom, selector } from 'recoil';
import { Campaign } from '../api/types';
import { api } from '../api/ws';
import { mapIdState } from './mapState';

export const campaignState = atom<Campaign>({
  key: 'CampaignState',
  default: selector<Campaign>({
    key: 'CampaignState/Default',
    get: async ({ get }) => api.getCampaign(get(mapIdState).game),
  }),
});

export const baseDefaultState = selector<number>({
  key: 'DefaultBaseSize',
  get: ({ get }) => get(campaignState).metrics.baseDefault,
});

export const baseOptionsState = selector<number[]>({
  key: 'BaseOptions',
  get: ({ get }) => get(campaignState).metrics.baseOptions,
})

export const hasFacingState = selector<boolean>({
  key: 'HasFacingState',
  get: ({ get }) => get(campaignState).metrics.hasFacing,
});

export const arcDegreesState = selector<number>({
  key: 'ArcDegrees',
  get: ({ get }) => get(campaignState).metrics.arcDegrees
})

export const cellSizeState = selector<{ amount: number, unit: string }>({
  key: 'CellSize',
  get: ({ get }) => {
    const formattedCellSize = get(campaignState).metrics.cellSize;

    const result = /^(?<amount>\d+)\s(?<unit>\p{L}+)$/u.exec(formattedCellSize);

    if (!result || !result.groups) throw new Error('Augh!');

    const { groups: { amount, unit } } = result;

    return { amount: +amount, unit };
  }
})