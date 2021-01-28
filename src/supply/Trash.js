import { Delete } from '@material-ui/icons';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { tokenGroupUpdateRequested } from './generatorsSlice';
import { tokenTrashRequested } from '../map/tokenSlice';
import './Trash.css';
// import { useBroadcast } from '../app/useBroadcast';

export function Trash() {
  const dispatch = useDispatch();
  // const broadcast = useBroadcast();

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.PLACED_TOKEN, ItemTypes.STASHED_TOKEN],
    drop: (item) => {
      const { id } = item;

      switch (item.type) {
        case ItemTypes.PLACED_TOKEN:
        case ItemTypes.STASHED_TOKEN:
          dispatch(tokenTrashRequested(id));
          /// broadcast(tokenTrashed(id));
          break;
        case ItemTypes.GENERATOR:
          dispatch(tokenGroupUpdateRequested({ id, deleted: true }));
          break;
        default:
      }
    },
  });

  return (
    <div ref={drop} className="trash">
      <Delete style={{ fontSize: '1.5rem' }} />
    </div>
  );
}
