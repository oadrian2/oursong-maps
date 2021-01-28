import { useDrag } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';

export function MarkerGroup({ id }) {
  const [, drag] = useDrag({
    item: { type: ItemTypes.GENERATOR, id },
    collect: () => ({}),
  });

  return <div ref={drag}>RM</div>;
}
