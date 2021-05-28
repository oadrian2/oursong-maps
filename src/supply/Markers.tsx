import { useSelector } from 'react-redux';
import { Generator } from './Generator';
import { selectMarkerGenerators } from './generatorsSlice';

export function Markers() {
  const markerIds = useSelector(selectMarkerGenerators).map(({ id }) => id);

  return (
    <div className="token-container" style={{transform: 'translateY(16px)'}}>
      {markerIds.map((id) => <Generator key={id} id={id} />)}
    </div>
  );
}
