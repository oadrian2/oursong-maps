import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { ItemTypes } from '../ItemTypes';
import { selectGeneratorById } from './generatorsSlice';

export function Generator({ id }) {
  const { shapeType, shape } = useSelector((state) => selectGeneratorById(state, id));

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.GENERATOR, id },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return {
      'figure': <FigureToken ref={drag} isTemplate={true} {...shape} scale={1} />,
      'marker': <MarkerToken ref={drag} isTemplate={true} {...shape} effectRadius={0} />
  }[shapeType]
}
