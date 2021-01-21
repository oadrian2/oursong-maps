import { Delete } from '@material-ui/icons';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { tokenTrashed } from '../doodads/tokenSlice';
import { ItemTypes } from '../ItemTypes';
import { tokenGroupTrashed } from './tokenGroupSlice';
import './Trash.css';

export default function Trash() {
  const dispatch = useDispatch();

  const [, drop] = useDrop({
    accept: [ItemTypes.TOKEN, ItemTypes.TOKEN_GROUP],
    drop: (item) => {
      const { id } = item;

      switch (item.type) {
        case ItemTypes.TOKEN:
          dispatch(tokenTrashed(id));
          break;
        case ItemTypes.TOKEN_GROUP:
          dispatch(tokenGroupTrashed(id));
          break;
        default:
      }
    },
  });

  return (
    <div ref={drop} className="trash">
      <Delete />
    </div>
  );
}
