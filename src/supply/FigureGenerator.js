import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { ItemTypes } from '../ItemTypes';
import { selectGeneratorById } from './generatorsSlice';

export function FigureGenerator({ id }) {
  const { shape: { prefix, label, allegiance, isGroup } } = useSelector((state) => selectGeneratorById(state, id));

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.GENERATOR, id },
    collect: () => ({}),
  });

  const effectivePrefix = isGroup ? `${prefix}#` : prefix;

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return <FigureToken ref={drag} label={effectivePrefix} title={label} allegiance={allegiance} />;
}
