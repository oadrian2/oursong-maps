import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { stashTokenRequested } from '../map/tokenSlice';
import { pathStopped } from '../ruler/rulerSlice';
import { Generator } from './Generator';
import { selectClaimedGeneratorIds, selectFigureGeneratorIds, selectMarkerGenerators } from './generatorsSlice';
import { Stash } from './Stash';
import './Supply.css';
import { Trash } from './Trash';

export function Supply() {
  const dispatch = useDispatch();

  const claimedGenereratorIds = useSelector(selectClaimedGeneratorIds);
  const allGeneratorIds = useSelector(selectFigureGeneratorIds);

  const shownIds = claimedGenereratorIds.length ? claimedGenereratorIds : allGeneratorIds;

  const markerIds = useSelector(selectMarkerGenerators).map((m) => m.id);

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
          <Generator key={id} id={id} />
        ))}
      </div>
      <hr style={{ width: '100%' }} />
      <div className="supply-generators">
        {markerIds.map((id) => (
          <Generator key={id} id={id} />
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
