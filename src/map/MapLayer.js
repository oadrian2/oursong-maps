import { nanoid } from '@reduxjs/toolkit';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useTitle } from 'react-use';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import { selectMapTitle } from './mapSlice';
import { TokenLayer } from './TokenLayer';
import { tokenPlacementRequested, unstashTokenToRequested } from './tokenSlice';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef();

  const title = useSelector(selectMapTitle);

  useTitle(`OurSong Maps - ${title}`);

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.STASHED_TOKEN],
    drop: (item, monitor) => {
      const { id, type } = item;

      const position = ref.current.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

      switch (type) {
        case ItemTypes.STASHED_TOKEN:
          dispatch(unstashTokenToRequested({ id, position }));
          break;
        case ItemTypes.GENERATOR:
          dispatch(tokenPlacementRequested({ id: nanoid(), generator: id, position }));
          break;
        default:
      }
    },
  });

  return (
    <RulerOverlay ref={ref}>
      <div ref={drop} className="map-layer">
        <MapImage />
        <TokenLayer />
      </div>
    </RulerOverlay>
  );
}
