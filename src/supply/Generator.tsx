import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { ItemTypes } from '../ItemTypes';
import { selectGeneratorById } from './generatorsSlice';

export function Generator({ id }: GeneratorProps) {
  const { shapeType, shape } = useSelector((state: RootState) => selectGeneratorById(state, id)!);

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.GENERATOR, id },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return {
    figure: <FigureToken ref={drag} isTemplate={true} {...shape} index={0} />,
    marker: <MarkerToken ref={drag} isTemplate={true} {...shape} effectRadius={0} />,
  }[shapeType];
}

type GeneratorProps = { id: string | number };
