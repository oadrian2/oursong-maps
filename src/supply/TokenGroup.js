import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { NameToken } from '../doodads/NameToken';
import { ItemTypes } from '../ItemTypes';
import { selectTokenGroupById } from './tokenGroupSlice';

export default function TokenGroup({ id }) {
  const { prefix, label, allegiance }  = useSelector((state) => selectTokenGroupById(state, id));

  const [, drag] = useDrag({
    item: { type: ItemTypes.TOKEN_GROUP, id, shape: { type: 'token', prefix, label, allegiance } },
    collect: () => ({}),
  });

  return <NameToken ref={drag} label={prefix} title={label} allegiance={allegiance} />;
}
