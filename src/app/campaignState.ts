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
