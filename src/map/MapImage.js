import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapImage } from './mapSlice';
import { tokenDeselected } from './selectionSlice';

export function MapImage() {
  const dispatch = useDispatch();

  const onClick = useCallback(
    (event) => {
      if (event.button === 2) return;

      dispatch(tokenDeselected(null));
    },
    [dispatch]
  );

  const { src, width } = useSelector(selectMapImage);

  return <img draggable="false" style={{ width }} src={src} alt="the map" onClick={onClick} />;
}
