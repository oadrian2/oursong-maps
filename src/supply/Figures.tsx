import { useRecoilValue } from 'recoil';
import { claimedFigureGeneratorListState } from '../app/mapState';
import { Generator } from './Generator';

export function Figures() {
  const claimedGenereratorIds = useRecoilValue(claimedFigureGeneratorListState);

  return claimedGenereratorIds.length ? (
    <>
      {claimedGenereratorIds.map((id) => (
        <Generator key={id} id={id} />
      ))}
    </>
  ) : (
    <div className="token-container-empty-label">Models</div>
  );
}
