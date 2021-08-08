import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { mapImageState } from '../app/mapState';

export function MapImage({ onClick = () => {} }: MapImageProps) {
  const handleClick = useCallback(
    (event) => {
      if (event.button === 2) return;

      onClick(event);
    },
    [onClick]
  );

  const { src, width } = useRecoilValue(mapImageState);

  return <img draggable="false" style={{ width }} src={src} alt="the map" onClick={handleClick} />;
}

export interface MapImageProps {
  onClick?: React.MouseEventHandler;
}
