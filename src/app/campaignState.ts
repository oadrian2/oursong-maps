import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { Campaign, CampaignGroup } from '../api/types';
import { api } from '../api/ws';
import { routedGameKeyState } from '../stores/routedState';

export const routedCampaignState = atom<Campaign>({
  key: 'RoutedCampaign',
  default: selector<Campaign>({
    key: 'RoutedCampaign/Default',
    get: async ({ get }) => get(campaignState(get(routedGameKeyState))),
  }),
});

export const routedCampaignMetricsState = selector<Campaign['metrics']>({
  key: 'RoutedCampaignMetrics',
  get: ({ get }) => get(routedCampaignState).metrics,
});

export const campaignState = atomFamily<Campaign, string>({
  key: 'Campaign',
  default: selectorFamily<Campaign, string>({
    key: 'Campaign/Default',
    get: (game: string) => async () => {
      return {
        ...(await api.getCampaign(game)),
        maps: await api.getMapsByCampaign(game),
      };
    },
  }),
});

export const campaignsState = atom<Campaign[]>({
  key: 'Campaigns',
  default: selector<Campaign[]>({
    key: 'Campaigns/Default',
    get: async () => [...(await api.getCampaigns())].sort(({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB)),
  }),
});

export const groupsState = selector<CampaignGroup[]>({
  key: 'CampaignGroups',
  get: ({ get }) => [...get(routedCampaignState).groups].sort((a, b) => a.name.localeCompare(b.name)),
});

export const baseDefaultState = selector<number>({
  key: 'DefaultBaseSize',
  get: ({ get }) => get(routedCampaignState).metrics.baseDefault,
});

export const baseOptionsState = selector<number[]>({
  key: 'BaseOptions',
  get: ({ get }) => get(routedCampaignState).metrics.baseOptions,
});

export const hasFacingState = selector<boolean>({
  key: 'HasFacing',
  get: ({ get }) => get(routedCampaignState).metrics.hasFacing,
});

export const arcDegreesState = selector<number>({
  key: 'ArcDegrees',
  get: ({ get }) => get(routedCampaignState).metrics.arcDegrees,
});

export const tagsDefaultState = selector<string[]>({
  key: 'TagsDefault',
  get: ({ get }) => get(routedCampaignState).tags,
});

export const cellSizeState = selector<{ amount: number; unit: string }>({
  key: 'CellSize',
  get: ({ get }) => {
    const formattedCellSize = get(routedCampaignState).metrics.cellSize;

    const result = calculateCellSize(formattedCellSize);

    if (!result) throw new Error('Augh!');

    return result;
  },
});

export function calculateCellSize(formattedCellSize: string): { amount: number; unit: string } | null {
  const result = /^(?<amount>\d+)\s(?<unit>\p{L}+)$/u.exec(formattedCellSize);

  if (!result || !result.groups) return null;

  const {
    groups: { amount, unit },
  } = result;

  return { amount: +amount, unit };
}
