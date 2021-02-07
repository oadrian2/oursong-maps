import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { ItemTypes } from '../ItemTypes';
import { selectGeneratorById } from './generatorsSlice';

export function FigureGenerator({ id }) {
  const { shape } = useSelector((state) => selectGeneratorById(state, id));

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.GENERATOR, id },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return <FigureToken ref={drag} isTemplate={true} {...shape} />;
}
