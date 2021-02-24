import { nanoid } from '@reduxjs/toolkit';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import { TokenLayer } from './TokenLayer';
import { tokenPlacementRequested, unstashTokenToRequested } from './tokenSlice';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef();

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
