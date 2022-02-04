import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { isFigureShape, isMarkerShape, ItemTypes } from '../api/types';
import { generatorState } from '../app/mapState';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';

export function Generator({ id }: GeneratorProps) {
  const generator = useRecoilValue(generatorState(id))!;

  const [, drag, preview] = useDrag({
    type: ItemTypes.GENERATOR,
    item: { id, type: ItemTypes.GENERATOR },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div ref={drag}>
      {isFigureShape(generator.shape) && <FigureToken name={generator.name} {...generator.shape} />}
      {isMarkerShape(generator.shape) && <MarkerToken name={generator.name} {...generator.shape} effectRadius={0} />}
    </div>
  );
}

type GeneratorProps = { id: string };
