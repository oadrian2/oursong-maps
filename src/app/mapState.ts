import { atom, selector, selectorFamily } from 'recoil';
import {
  FigureShape,
  Generator,
  GeneratorID,
  isFigureShape,
  isMarkerShape,
  MarkerShape,
  PartitionedID,
  Placement,
  TokenColor,
} from '../api/types';
import { api } from '../api/ws';
import { campaignState } from './campaignState';

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

export const mapIdState = atom<PartitionedID>({
  key: 'MapID',
  default: new Promise(() => {}), // block until set
});

export const mapState = atom<Map>({
  key: 'Map',
  default: selector<Map>({
    key: 'MapState/Default',
    get: async ({ get }) => await api.getMap(get(mapIdState)!),
  }),
});

export const mapTitleState = selector<string>({
  key: 'MapTitle',
  get: ({ get }) => {
    const { title } = get(mapState);

    return title;
  },
});

export const createUniqueComparitor =
  <T, P>(selector: (x: T) => P) =>
  (value: T, index: number, self: T[]) =>
    self.findIndex((item) => selector(item) === selector(value)) === index;

export const mapGeneratorsState = selector<any[]>({
  key: 'MapGenerators',
  get: ({ get }) => {
    const { generators: campaignGenerators } = get(campaignState);
    const { generators } = get(mapState);

    return [...generators, ...campaignGenerators, ...markerGenerators].filter(createUniqueComparitor((x) => x.id)).sort(sortComparer);
  },
});

export const mapImageState = selector<{ src: string; width: number; height: number }>({
  key: 'MapImage',
  get: ({ get }) => {
    const {
      game,
      id,
      map: { image, width, height, scale },
    } = get(mapState);

    return {
      src: new URL(`/maps/${game}/${id}/${image}`, process.env.REACT_APP_STORAGE_URL).href,
      width: width * scale,
      height: height * scale,
      scale,
    };
  },
});

export const mapZoomState = atom<number>({
  key: 'MapZoom',
  default: 1.0,
});

export const trackedPositionState = atom<Placement | null>({
  key: 'TrackedPosition',
  default: null,
});

export const viewInactiveState = atom<boolean>({
  key: 'ViewInactive',
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
      .filter((g) => isFigureShape(g.shape))
      .map((g) => g.id),
});

export const markerGeneratorListState = selector<GeneratorID[]>({
  key: 'MarkerGeneratorList',
  get: ({ get }) =>
    get(mapGeneratorsState)
      .filter((g) => isMarkerShape(g.shape))
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
  key: 'Generator',
  get:
    (id) =>
    ({ get }) =>
      get(mapGeneratorsState).find((g) => g.id === id),
});

export const generatorsByColorState = selector<Record<TokenColor, GeneratorID[]>>({
  key: 'GeneratorsByColor',
  get: ({ get }) => {
    const generators = get(mapGeneratorsState).filter((g) => isFigureShape(g.shape));

    return generators.reduce((result, { id, shape: { color } }) => {
      result[color] = [...(result[color] || []), id];

      return result;
    }, {} as Record<TokenColor, GeneratorID[]>);
  },
});

const sortComparer = (generatorA: Generator, generatorB: Generator) =>
  generatorA.shape.type.localeCompare(generatorB.shape.type) ||
  +(isFigureShape(generatorA.shape) && isFigureShape(generatorB.shape) && figureComparer(generatorA.shape, generatorB.shape)) ||
  +(isMarkerShape(generatorA.shape) && isMarkerShape(generatorB.shape) && markerComparer(generatorA.shape, generatorB.shape));

const figureComparer = (
  { label: labelA, color: colorA, isGroup: isGroupA = false }: FigureShape,
  { label: labelB, color: colorB, isGroup: isGroupB = false }: FigureShape
) => colorA.localeCompare(colorB) || +isGroupA - +isGroupB || labelA.localeCompare(labelB);

const markerComparer = ({ color: colorA }: MarkerShape, { color: colorB }: MarkerShape) => colorA.localeCompare(colorB);

// TODO: find a better solution
const markerGenerators: Generator[] = [
  {
    id: 'marker:red',
    name: 'Marker',
    shape: {
      type: 'marker',
      color: TokenColor.red,
    },
  },
  {
    id: 'marker:blue',
    name: 'Marker',
    shape: {
      type: 'marker',
      color: TokenColor.blue,
    },
  },
  {
    id: 'marker:green',
    name: 'Marker',
    shape: {
      type: 'marker',
      color: TokenColor.green,
    },
  },
];
