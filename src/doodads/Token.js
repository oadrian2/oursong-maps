import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { NameToken } from './NameToken';
import { selectTokenById } from './tokenSlice';

export default function Token({ id }) {
  const { shape: { prefix, label, allegiance, index = 1, radius = 30} } = useSelector((state) => selectTokenById(state, id));

  const [, drag] = useDrag({
    item: { type: ItemTypes.TOKEN, id },
    collect: () => ({}),
  });

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, [preview])

  return <NameToken ref={drag} label={`${prefix}${index}`} title={`${label} ${index}`} allegiance={allegiance} radius={radius} />;
}
