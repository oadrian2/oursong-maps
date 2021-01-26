import { nanoid } from '@reduxjs/toolkit';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { tokenPlacementRequested, tokenUpsertRequested } from '../doodads/tokenSlice';
import { ItemTypes } from '../ItemTypes';
import { MeasurementOverlay } from '../measurement/MeasurementOverlay';
import MapImage from './MapImage';
import './MapLayer.css';
import TokenLayer from './TokenLayer';

export default function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef();
  const mouseLocation = useRef();

  const [scale] = useState(1);

  const [, drop] = useDrop({
    accept: [ItemTypes.TOKEN, ItemTypes.TOKEN_GROUP],
    hover: (item, monitor) => {
      mouseLocation.current = monitor.getSourceClientOffset();
      console.info(`loc`, monitor.getInitialSourceClientOffset(), mouseLocation.current);
    },
    drop: (item, monitor) => {
      const { id, type, shape } = item;

      const position = ref.current.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

      switch (type) {
        case ItemTypes.TOKEN:
          dispatch(tokenUpsertRequested({ id, position }));
          break;
        case ItemTypes.TOKEN_GROUP:
          dispatch(tokenPlacementRequested({ id: nanoid(), group: id, shape, position }));
          break;
        default:
      }
    },
  });

  return (
    <MeasurementOverlay ref={ref}>
      <div ref={drop} className="map-layer" style={{ transform: `scale(${scale})` }}>
        <MapImage />
        <TokenLayer />
      </div>
    </MeasurementOverlay>
  );
}
