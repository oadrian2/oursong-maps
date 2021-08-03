import { atom, selector, selectorFamily } from 'recoil';
import { Color, PartitionedID } from './state';
import { TokenAllegiance } from './tokenState';

///

export type GeneratorID = string;

type FigureGenerator = {
  id: GeneratorID;
  // label: string;
  shapeType: 'figure';
  shape: {
    prefix: string;
    label: string; // TODO: move out
    allegiance: TokenAllegiance;
    color?: Color;
    baseSize?: number;
    isGroup?: boolean;
  };
};

type MarkerGenerator = {
  id: GeneratorID;
  // label: string;
  shapeType: 'marker';
  shape: {
    label: string; // TODO: move out
    color: Color;
    baseSize?: number; // @decprecated
  };
};

export type Generator = FigureGenerator | MarkerGenerator;

export function isFigureGenerator(g: Generator): g is FigureGenerator {
  return g.shapeType === 'figure';
}

export function isMarkerGenerator(g: Generator): g is MarkerGenerator {
  return g.shapeType === 'marker';
}

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

export const mapState = selector<Map>({
  key: 'MapState',
  get: async ({ get }) => {
    const { game, id } = get(mapId)!;

    const response = await fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}`);

    if (response.status !== 200) throw Error('Augh!');

    return response.json();
  },
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

export const generatorsByAllegianceState = selector<{ [key in TokenAllegiance]: GeneratorID[] }>({
  key: 'GeneratorsByAllegiance',
  get: ({ get }) => {
    const generators = get(mapGeneratorsState).filter(isFigureGenerator);

    return generators.reduce((result, { id, shape: { allegiance } }) => {
      result[allegiance] = [...(result[allegiance] || []), id];

      return result;
    }, {} as { [key in TokenAllegiance]: GeneratorID[] });
  },
});

const sortComparer = (generatorA: Generator, generatorB: Generator) =>
  generatorA.shapeType.localeCompare(generatorB.shapeType) ||
  +(generatorA.shapeType === 'figure' && generatorB.shapeType === 'figure' && figureComparer(generatorA, generatorB)) ||
  +(generatorA.shapeType === 'marker' && generatorB.shapeType === 'marker' && markerComparer(generatorA, generatorB));

const figureComparer = (
  { shape: { prefix: prefixA, allegiance: allegianceA, isGroup: isGroupA = false } }: FigureGenerator,
  { shape: { prefix: prefixB, allegiance: allegianceB, isGroup: isGroupB = false } }: FigureGenerator
) => allegianceA.localeCompare(allegianceB) || +isGroupA - +isGroupB || prefixA.localeCompare(prefixB);

const markerComparer = ({ shape: { color: colorA } }: MarkerGenerator, { shape: { color: colorB } }: MarkerGenerator) =>
  colorA.localeCompare(colorB);

// TODO: find a better solution
const markerGenerators: MarkerGenerator[] = [
  {
    id: 'marker:red',
    shapeType: 'marker',
    shape: {
      label: 'Red',
      color: 'red',
    },
  },
  {
    id: 'marker:blue',
    shapeType: 'marker',
    shape: {
      label: 'Blue',
      color: 'blue',
    },
  },
  {
    id: 'marker:green',
    shapeType: 'marker',
    shape: {
      label: 'Green',
      color: 'green',
    },
  },
];
