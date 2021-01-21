import { useDrag } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';

export default function MarkerGroup({ id }) {
  const [, drag] = useDrag({
    item: { type: ItemTypes.TOKEN_GROUP, id, shape: { type: 'marker' } },
    collect: () => ({}),
  });

  return <div ref={drag}>Mar</div>;
}
