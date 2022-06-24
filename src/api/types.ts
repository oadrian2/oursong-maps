export type PartitionedID = { game: string; id: string }; // deprecated

export type LocalID<T> = { id: T }; // deprecated

///

export type UserID = string;

///

export type Point = { x: number; y: number };

export type Scale = number;

export type Facing = number;

export type Angle = number;

export type Placement = { position: Point; scale: Scale; facing: Facing | null };

export type Stashed = { position: null; scale: Scale; facing: null };

///

export type TokenID = string;

export enum TokenColor {
  red = 'red',
  yellow = 'yellow',
  green = 'green',
  cyan = 'cyan',
  blue = 'blue',
  magenta = 'magenta',
}

export type Token = {
  generator: string;
  position: Point | null;
  deleted: boolean;
  visible: boolean;
  active: boolean;
  facing: number | null;
  path: Point[];
  shape?: Partial<FigureShape> | Partial<MarkerShape>; // override properties
  notes: string;
  tags: string[];
};

export type FullToken = Token & {
  name: string;
  label: string;
  shape: FigureShape | MarkerShape;
  scale: Scale;
};

///

export type MapID = PartitionedID;

export type MapImage = {
  image: string;
  scale: number;
  width: number;
  height: number;
};

export type Map = MapID & {
  title: string;
  map: MapImage;
  generators: Generator[];
};

///

export type GeneratorID = string;

export type FigureShape = {
  type: 'figure';
  color: TokenColor;
  label: string;
  isGroup: boolean;
  baseSize: number;
};

export type MarkerShape = {
  type: 'marker';
  color: TokenColor;
  auraSize?: number;
};

export type Generator = {
  id: GeneratorID;
  name: string;
  shape: FigureShape | MarkerShape;
};

export const isFigureShape = (s: FigureShape | MarkerShape): s is FigureShape => s.type === 'figure';

export const isMarkerShape = (s: FigureShape | MarkerShape): s is MarkerShape => s.type === 'marker';

//

export type ShapeAura = {
  radius: Scale; // not sure this is right; not sure it should be radius
};

///

export type Ruler =
  | {
      origin: null;
      points: [];
      attached: null;
      when: Date;
    }
  | {
      origin: Point;
      points: [Point, ...Point[]];
      attached: TokenID | null;
      when: Date;
    };

///

export type PlayerID = string;

export type Player = {
  id: PlayerID;
  name: string;
};

///

export const ItemTypes = {
  GENERATOR: 'generator',
  STASHED_TOKEN: 'stashed-token',
};

///

export type CampaignID = string;

export type CampaignGroup = {
  name: string;
  generators: GeneratorID[];
};

export type Campaign = {
  id: string;
  title: string;
  metrics: {
    style: 'centerToCenterNormalized' | 'zone';
    hasFacing: boolean;
    baseDefault: number;
    baseOptions: number[];
    cellSize: string;
    arcDegrees: number;
  };
  generators: Generator[];
  groups: CampaignGroup[];
  tags: string[];
  maps?: Map[]
};

export type CampaignRef = {
  id: string;
  title: string;
}