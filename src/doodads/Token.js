import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { NameToken } from './NameToken';
import { selectTokenById } from './tokenSlice';

export default function Token({ id }) {
  const { shape: { prefix, label, allegiance, index = 1, radius = 30} } = useSelector((state) => selectTokenById(state, id));

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.TOKEN, id },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview])

  return <NameToken ref={drag} label={`${prefix}${index}`} title={`${label} ${index}`} allegiance={allegiance} radius={radius} />;
}
