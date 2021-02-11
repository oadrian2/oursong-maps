import { Delete } from '@material-ui/icons';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { generatorUpdateRequested } from './generatorsSlice';
import { trashTokenRequested } from '../map/tokenSlice';
import './Trash.css';
import { pathStopped, requestUpdateRemoteRuler } from '../ruler/rulerSlice';

export function Trash() {
  const dispatch = useDispatch();

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.PLACED_TOKEN, ItemTypes.STASHED_TOKEN],
    drop: (item) => {
      const { id } = item;

      switch (item.type) {
        case ItemTypes.PLACED_TOKEN:
        case ItemTypes.STASHED_TOKEN:
          dispatch(pathStopped());
          dispatch(requestUpdateRemoteRuler());
          dispatch(trashTokenRequested({ id }));
          break;
        case ItemTypes.GENERATOR:
          dispatch(generatorUpdateRequested({ id, deleted: true }));
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
