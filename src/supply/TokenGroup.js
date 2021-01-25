import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { NameToken } from '../doodads/NameToken';
import { ItemTypes } from '../ItemTypes';
import { selectTokenGroupById } from './tokenGroupSlice';

export default function TokenGroup({ id }) {
  const { prefix, label, allegiance }  = useSelector((state) => selectTokenGroupById(state, id));

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.TOKEN_GROUP, id, shape: { type: 'token', prefix, label, allegiance } },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview])

  return <NameToken ref={drag} label={prefix} title={label} allegiance={allegiance} />;
}
