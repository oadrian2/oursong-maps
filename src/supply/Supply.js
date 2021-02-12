import { useSelector } from 'react-redux';
import { Generator } from './Generator';
import { selectClaimedGeneratorIds, selectFigureGeneratorIds, selectMarkerGenerators } from './generatorsSlice';
import { Stash } from './Stash';
import './Supply.css';
import { Trash } from './Trash';

export function Supply() {
  const claimedGenereratorIds = useSelector(selectClaimedGeneratorIds);
  const allGeneratorIds = useSelector(selectFigureGeneratorIds);

  const shownIds = claimedGenereratorIds.length ? claimedGenereratorIds : allGeneratorIds;

  const markerIds = useSelector(selectMarkerGenerators).map((m) => m.id);

  return (
    <div className="supply">
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
      <Stash />
      <hr style={{ width: '100%' }} />
      <div className="supply-fill" />
      <Trash />
    </div>
  );
}
