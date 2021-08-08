import { useRecoilValue } from 'recoil';
import { markerGeneratorListState } from '../app/mapState';
import { Generator } from './Generator';

export function Markers() {
  const markerIds = useRecoilValue(markerGeneratorListState);

  return (
    <div className="token-container" style={{ transform: 'translateY(16px)' }}>
      {markerIds.map((id) => (
        <Generator key={id} id={id} />
      ))}
    </div>
  );
}
