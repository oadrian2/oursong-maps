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
    <>
      {isFigureShape(generator.shape) && <FigureToken ref={drag} name={generator.label} {...generator.shape} isTemplate={true} index={0} />}
      {isMarkerShape(generator.shape) && <MarkerToken ref={drag} name={generator.label} {...generator.shape} effectRadius={0} />}
    </>
  );
}

type GeneratorProps = { id: string };
