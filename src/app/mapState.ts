import { atom, selector, selectorFamily } from 'recoil';
import {
  FigureGenerator,
  Generator,
  GeneratorID,
  isFigureGenerator,
  isMarkerGenerator,
  MarkerGenerator,
  PartitionedID,
  TokenColor,
} from '../api/types';
import { api } from '../api/ws';

///

export type MapID = PartitionedID;

export type Map = MapID & {
  title: string;
  map: MapImage;
  generators: Generator[];
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

export const mapState = atom<Map>({
  key: 'MapState',
  default: selector<Map>({
    key: 'MapState/Default',
    get: async ({ get }) => await api.getMap(get(mapId)!),
  }),
});

export const mapTitleState = selector<string>({
  key: 'MapTitle',
  get: ({ get }) => {
    const { title } = get(mapState);

    return title;
  },
});

export const mapGeneratorsState = selector<any[]>({
  key: 'MapGenerators',
  get: ({ get }) => {
    const { generators } = get(mapState);

    return [...generators, ...markerGenerators].sort(sortComparer);
  },
});

export const mapImageState = selector<{ src: string; width: number }>({
  key: 'MapImage',
  get: ({ get }) => {
    const {
      game,
      id,
      map: { image, width, scale },
    } = get(mapState);

    return {
      src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
      width: width * scale,
    };
  },
});

export const mapZoomState = atom<number>({
  key: 'MapZoom',
  default: 1.0,
});

export const viewInactiveState = atom<boolean>({
  key: 'ViewInactiveState',
  default: false,
});

export const generatorListState = selector<GeneratorID[]>({
  key: 'GeneratorList',
  get: ({ get }) => get(mapGeneratorsState).map((g) => g.id),
});

export const figureGeneratorListState = selector<GeneratorID[]>({
  key: 'FigureGeneratorList',
  get: ({ get }) =>
    get(mapGeneratorsState)
      .filter(isFigureGenerator)
      .map((g) => g.id),
});

export const markerGeneratorListState = selector<GeneratorID[]>({
  key: 'MarkerGeneratorList',
  get: ({ get }) =>
    get(mapGeneratorsState)
      .filter(isMarkerGenerator)
      .map((g) => g.id),
});

export const claimedFigureGeneratorListState = atom<GeneratorID[]>({
  key: 'ClaimedFigureGeneratorList',
  default: [],
});

export const controlledGeneratorListState = selector<GeneratorID[]>({
  key: 'ControlledGeneratorList',
  get: ({ get }) => [...get(claimedFigureGeneratorListState), ...get(markerGeneratorListState)],
});

export const isControlledGeneratorState = selectorFamily<boolean, GeneratorID>({
  key: 'IsControlGenerator',
  get:
    (id: GeneratorID) =>
    ({ get }) =>
      get(controlledGeneratorListState).includes(id),
});

export const generatorState = selectorFamily<Generator | null, GeneratorID>({
  key: 'GeneratorState',
  get:
    (id) =>
    ({ get }) =>
      get(mapGeneratorsState).find((g) => g.id === id),
});

export const generatorsByColorState = selector<Record<TokenColor, GeneratorID[]>>({
  key: 'GeneratorsByColor',
  get: ({ get }) => {
    const generators = get(mapGeneratorsState).filter(isFigureGenerator);

    return generators.reduce((result, { id, shape: { color } }) => {
      result[color] = [...(result[color] || []), id];

      return result;
    }, {} as Record<TokenColor, GeneratorID[]>);
  },
});

const sortComparer = (generatorA: Generator, generatorB: Generator) =>
  generatorA.shapeType.localeCompare(generatorB.shapeType) ||
  +(generatorA.shapeType === 'figure' && generatorB.shapeType === 'figure' && figureComparer(generatorA, generatorB)) ||
  +(generatorA.shapeType === 'marker' && generatorB.shapeType === 'marker' && markerComparer(generatorA, generatorB));

const figureComparer = (
  { shape: { prefix: prefixA, color: colorA, isGroup: isGroupA = false } }: FigureGenerator,
  { shape: { prefix: prefixB, color: colorB, isGroup: isGroupB = false } }: FigureGenerator
) => colorA.localeCompare(colorB) || +isGroupA - +isGroupB || prefixA.localeCompare(prefixB);

const markerComparer = ({ shape: { color: colorA } }: MarkerGenerator, { shape: { color: colorB } }: MarkerGenerator) =>
  colorA.localeCompare(colorB);

// TODO: find a better solution
const markerGenerators: MarkerGenerator[] = [
  {
    id: 'marker:red',
    shapeType: 'marker',
    shape: {
      label: 'Marker',
      color: TokenColor.red,
      scale: 1.0,
    },
  },
  {
    id: 'marker:blue',
    shapeType: 'marker',
    shape: {
      label: 'Marker',
      color: TokenColor.blue,
      scale: 1.0,
    },
  },
  {
    id: 'marker:green',
    shapeType: 'marker',
    shape: {
      label: 'Marker',
      color: TokenColor.green,
      scale: 1.0,
    },
  },
];
