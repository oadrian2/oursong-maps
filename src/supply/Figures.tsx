import { useRecoilValue } from 'recoil';
import { claimedFigureGeneratorListState } from '../map/State';
import { Generator } from './Generator';

export function Figures() {
  const claimedGenereratorIds = useRecoilValue(claimedFigureGeneratorListState);

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
