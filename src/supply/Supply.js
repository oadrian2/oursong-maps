import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { stashTokenRequested } from '../map/tokenSlice';
import { Stash } from './Stash';
import './Supply.css';
import { FigureGenerator } from './FigureGenerator';
import { selectClaimedGeneratorIds, selectGeneratorIds } from './generatorsSlice';
import { Trash } from './Trash';
import { pathStopped } from '../ruler/rulerSlice';

export function Supply() {
  const dispatch = useDispatch();

  const claimedGenereratorIds = useSelector(selectClaimedGeneratorIds);
  const allGeneratorIds = useSelector(selectGeneratorIds);

  const shownIds = claimedGenereratorIds.length ? claimedGenereratorIds : allGeneratorIds;

  const [, drop] = useDrop({
    accept: ItemTypes.PLACED_TOKEN,
    collect: () => ({}),
    drop: (item) => {
      const { id } = item;

      dispatch(stashTokenRequested({ id }));
      dispatch(pathStopped());
    },
  });

  return (
    <div ref={drop} className="supply">
      <div className="supply-generators">
        {shownIds.map((id) => (
          <FigureGenerator key={id} id={id} />
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
