import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { generatorState } from '../app/mapState';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { ItemTypes } from '../ItemTypes';

export function Generator({ id }: GeneratorProps) {
  const generator = useRecoilValue(generatorState(id))!;

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.GENERATOR, id },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <>
      {generator.shapeType === 'figure' && <FigureToken ref={drag} isTemplate={true} {...generator.shape} index={0} />}
      {generator.shapeType === 'marker' && <MarkerToken ref={drag} isTemplate={true} {...generator.shape} effectRadius={0} />}
    </>
  );
}

type GeneratorProps = { id: string };
