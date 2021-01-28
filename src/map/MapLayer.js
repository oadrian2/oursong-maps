import { nanoid } from '@reduxjs/toolkit';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { tokenPlacementRequested, tokenUpsertRequested } from './tokenSlice';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import './MapLayer.css';
import { TokenLayer } from './TokenLayer';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef();
  const mouseLocation = useRef();

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.PLACED_TOKEN, ItemTypes.STASHED_TOKEN],
    hover: (item, monitor) => {
      if (item.type !== ItemTypes.PLACED_TOKEN) return;

      mouseLocation.current = monitor.getSourceClientOffset();
      // console.info(`loc`, monitor.getInitialSourceClientOffset(), mouseLocation.current);
    },
    drop: (item, monitor) => {
      const { id, type } = item;

      const position = ref.current.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

      switch (type) {
        case ItemTypes.PLACED_TOKEN:
        case ItemTypes.STASHED_TOKEN:
          dispatch(tokenUpsertRequested({ id, position }));
          break;
        case ItemTypes.GENERATOR:
          dispatch(tokenPlacementRequested({ id: nanoid(), group: id, position }));
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
