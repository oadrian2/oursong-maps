import { useSelector } from 'react-redux';
import { Generator } from './Generator';
import { selectMarkerGenerators } from './generatorsSlice';

export function Markers() {
  const markerIds = useSelector(selectMarkerGenerators).map((m) => m.id);

  return markerIds.map((id) => <Generator key={id} id={id} />);
}
