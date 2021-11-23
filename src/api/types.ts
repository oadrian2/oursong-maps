export type PartitionedID = { game: string; id: string }; // deprecated

export type LocalID<T> = { id: T }; // deprecated

///

export type UserID = string;

///

export type Point = { x: number; y: number };

export type Scale = number;

export type Facing = number;

export type Angle = number;

export type Placement = { position: Point; scale: Scale; facing?: Facing };

///

export type TokenID = string;

export enum TokenColor {
  red = 'red',
  yellow = 'yellow',
  green = 'green',
  cyan = 'cyan',
  blue = 'blue',
  magenta = 'magenta'
}

export type Token = {
  generator: string;
  position: Point | null;
  deleted: boolean;
  visible: boolean;
  active: boolean;
  facing: number | null;
  path: Point[];
  shape?: Partial<Generator['shape']>
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

export type FigureGenerator = {
  id: GeneratorID;
  // label: string;
  shapeType: 'figure';
  shape: {
    prefix: string;
    label: string; // TODO: move out
    color: TokenColor;
    isGroup?: boolean;
    scale: number;
  };
};

export type MarkerGenerator = {
  id: GeneratorID;
  // label: string;
  shapeType: 'marker';
  shape: {
    label: string; // TODO: move out
    color: TokenColor;
    scale: number;
  };
};

export type Generator = FigureGenerator | MarkerGenerator;

export function isFigureGenerator(g: Generator): g is FigureGenerator {
  return g.shapeType === 'figure';
}

export function isMarkerGenerator(g: Generator): g is MarkerGenerator {
  return g.shapeType === 'marker';
}

//

export type FigureShape = { 
  label: string;
  color: TokenColor;
  scale: number;
}

export type MarkerShape = {
  color: TokenColor;
}

// 

export type ShapeAura = {
  radius: Scale; // not sure this is right; not sure it should be radius
}

///

export type Ruler = {
  origin: Point | null;
  points: Point[];
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
