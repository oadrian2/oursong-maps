import { useSelector } from 'react-redux';
import { selectMapImage } from './mapSlice';

export function MapImage() {
  const { src, scale } = useSelector(selectMapImage);
  const scalePercent = scale.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 0 });

  return (
    <span style={{ display: 'inline-block' }}>
      <img draggable="false" style={{ width: scalePercent }} src={src} alt="the map" />
    </span>
  );
}
