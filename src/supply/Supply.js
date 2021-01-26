import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { tokenStashRequested } from '../doodads/tokenSlice';
import { ItemTypes } from '../ItemTypes';
import Stash from './Stash';
import './Supply.css';
import TokenGroup from './TokenGroup';
import { selectTokenGroupIds } from './tokenGroupSlice';
import Trash from './Trash';

export default function Supply() {
  const dispatch = useDispatch();

  const tokenGroups = useSelector(selectTokenGroupIds);

  const [, drop] = useDrop({
    accept: ItemTypes.TOKEN,
    collect: () => ({}),
    drop: (item) => {
      const { id } = item;

      dispatch(tokenStashRequested(id));
    },
  });

  return (
    <div ref={drop} className="supply">
      <div className="supply-groups">
        {tokenGroups.map((id) => (
          <TokenGroup key={id} id={id} />
        ))}
      </div>
      <hr style={{ width: '100%' }} />
      <div className="supply-stashed">
        <Stash />
      </div>
      <hr style={{ width: '100%' }} />
      <div className="supply-fill" />
      <div className="supply-trash">
        <Trash />
      </div>
    </div>
  );
}
