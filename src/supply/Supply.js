import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { tokenStashRequested } from '../map/tokenSlice';
import { Stash } from './Stash';
import './Supply.css';
import { TokenGroup } from './FigureGenerator';
import { selectClaimedGeneratorIds } from './generatorsSlice';
import { Trash } from './Trash';
import { pathStopped } from '../ruler/rulerSlice';

export function Supply() {
  const dispatch = useDispatch();

  const tokenGroups = useSelector(selectClaimedGeneratorIds);

  const [, drop] = useDrop({
    accept: ItemTypes.PLACED_TOKEN,
    collect: () => ({}),
    drop: (item) => {
      const { id } = item;

      dispatch(tokenStashRequested(id));
      dispatch(pathStopped());
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
