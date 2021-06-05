/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { tokenDeselected } from './selectionSlice';
import { mapImage } from './State';

export function MapImage() {
  const dispatch = useDispatch();

  const onClick = useCallback(
    (event) => {
      if (event.button === 2) return;

      dispatch(tokenDeselected(null));
    },
    [dispatch]
  );

  const { src, width } = useRecoilValue(mapImage);

  return <img draggable="false" style={{ width }} src={src} alt="the map" onClick={onClick} />;
}
