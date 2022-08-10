import { isFigureShape, isMarkerShape, FigureShape, Generator, MarkerShape } from "../api/types";

const defaultComparer = (generatorA: Generator, generatorB: Generator) =>
  generatorA.shape.type.localeCompare(generatorB.shape.type) ||
  +(isFigureShape(generatorA.shape) && isFigureShape(generatorB.shape) && figureComparer(generatorA.shape, generatorB.shape)) ||
  +(isMarkerShape(generatorA.shape) && isMarkerShape(generatorB.shape) && markerComparer(generatorA.shape, generatorB.shape));

const figureComparer = (
  { label: labelA, color: colorA, isGroup: isGroupA = false }: FigureShape,
  { label: labelB, color: colorB, isGroup: isGroupB = false }: FigureShape
) => colorA.localeCompare(colorB) || +isGroupA - +isGroupB || labelA.localeCompare(labelB);

const markerComparer = ({ color: colorA }: MarkerShape, { color: colorB }: MarkerShape) => colorA.localeCompare(colorB);

export const defaultGeneratorComparer = defaultComparer;