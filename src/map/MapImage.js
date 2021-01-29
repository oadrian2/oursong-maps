import { useSelector } from 'react-redux';
import { selectMapImage } from './mapSlice';

export function MapImage() {
  const { src, width } = useSelector(selectMapImage);

  return <img draggable="false" style={{ width }} src={src} alt="the map" />;
}
