import { nanoid } from '@reduxjs/toolkit';
import { atom, atomFamily, selector } from 'recoil';
import { Placement, Point } from '../app/math';
import { Token } from './tokenSlice';

///

type TokenID = string;

export const tokenList = atom<TokenID[]>({
  key: 'TokenList',
  default: [],
});

export const tokenState = atomFamily<Token | null, TokenID>({
  key: 'TokenState',
  default: null,
});

export const tokenPlacement = atomFamily<Placement, TokenID>({
  key: 'TokenPlacement',
  // what to do here? Can you have a placement without it being on the map? Is scale necessary?
  default: { position: { x: 0.0, y: 0.0 }, scale: 1.0 },
});

export const tokenVisible = atomFamily<boolean, TokenID>({
  key: 'TokenVisible',
  default: true,
});

export const tokenActive = atomFamily<boolean, TokenID>({
  key: 'TokenActive',
  default: true,
});

type Color = 'red' | 'green' | 'blue' | 'yellow' | null;

type TokenAura = { color: Color; radius: number };

export const tokenAura = atomFamily<TokenAura | null, TokenID>({
  key: 'TokenAura',
  default: null,
});

///

type RulerID = string;

export const rulerList = atom<RulerID[]>({
  key: 'RulerList',
  default: [],
});

export const ownRulerID = atom<RulerID>({
  key: 'OwnRulerID',
  default: nanoid(),
});

type Ruler = {
  id: string;
  origin: Point | null;
  points: Point[];
};

export const rulerState = atomFamily<Ruler, RulerID>({
  key: 'RulerState',
  default: (param) => ({
    id: param,
    origin: null,
    points: [],
  }),
});

///

type PartitionedID = { game: string; id: string };

type Map = PartitionedID & {
  title: string;
  map: MapImage;
  generators: any[];
};

type MapImage = {
  image: string;
  scale: number;
  width: number;
  height: number;
};

export const mapId = atom<PartitionedID | null>({
  key: 'MapID',
  default: null,
});

export const mapState = selector<Map>({
  key: 'MapState',
  get: async ({ get }) => {
    const { game, id } = get(mapId)!;

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}`);

    if (response.status !== 200) throw Error('Augh!');

    return response.json();
  },
});

export const mapTitle = selector<string>({
  key: 'MapTitle',
  get: ({ get }) => {
    const { title } = get(mapState);

    return title;
  },
});

export const mapGenerators = selector<any[]>({
  key: 'MapGenerators',
  get: ({ get }) => {
    const { generators } = get(mapState);

    console.log(generators);

    return generators;
  },
});

export const mapImage = selector<{ src: string, width: number }>({
  key: 'MapImage',
  get: ({ get }) => {
    const { game, id, map: { image, width, scale } } = get(mapState);
  
    return {
      src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
      width: width * scale,
    };
  }
})

export const mapZoom = atom<number>({
  key: 'MapZoom',
  default: 1.0,
});

export const viewInactiveState = atom<boolean>({
  key: 'ViewInactiveState',
  default: true,
});
