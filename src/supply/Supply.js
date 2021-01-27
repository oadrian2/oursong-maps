import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { tokenStashRequested } from '../map/tokenSlice';
import { Stash } from './Stash';
import './Supply.css';
import { TokenGroup } from './TokenGroup';
import { selectClaimedGeneratorIds } from './tokenGroupSlice';
import { Trash } from './Trash';

export function Supply() {
  const dispatch = useDispatch();

  const tokenGroups = useSelector(selectClaimedGeneratorIds);

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
