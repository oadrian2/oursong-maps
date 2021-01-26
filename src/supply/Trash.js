import { Delete } from '@material-ui/icons';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { tokenGroupUpdateRequested } from './tokenGroupSlice';
import { tokenTrashRequested } from '../map/tokenSlice';
import './Trash.css';
// import { useBroadcast } from '../app/useBroadcast';

export function Trash() {
  const dispatch = useDispatch();
  // const broadcast = useBroadcast();

  const [, drop] = useDrop({
    accept: [ItemTypes.TOKEN, ItemTypes.TOKEN_GROUP],
    drop: (item) => {
      const { id } = item;

      switch (item.type) {
        case ItemTypes.TOKEN:
          dispatch(tokenTrashRequested(id));
          /// broadcast(tokenTrashed(id));
          break;
        case ItemTypes.TOKEN_GROUP:
          dispatch(tokenGroupUpdateRequested({ id, deleted: true }));
          break;
        default:
      }
    },
  });

  return (
    <div ref={drop} className="trash">
      <Delete style={{fontSize: '1.5rem' }} />
    </div>
  );
}
