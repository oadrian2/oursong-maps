import { useSelector } from 'react-redux';
import { Generator } from './Generator';
import { selectClaimedGeneratorIds } from './generatorsSlice';

export function Figures() {
  const claimedGenereratorIds = useSelector(selectClaimedGeneratorIds);

  return (
    <div className="token-container">
      {claimedGenereratorIds.length ? (
        claimedGenereratorIds.map((id) => <Generator key={id} id={id} />)
      ) : (
        <div className="token-container-empty-label">Models</div>
      )}
    </div>
  );
}
