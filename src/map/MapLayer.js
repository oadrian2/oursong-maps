import { nanoid } from '@reduxjs/toolkit';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { tokenPlacementRequested, tokenUpsertRequested } from './tokenSlice';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import './MapLayer.css';
import { TokenLayer } from './TokenLayer';
import { movedTo, pathStarted, pathStopped, selectMeasurement } from '../ruler/rulerSlice';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef();
  const mouseLocation = useRef();

  const ruler = useSelector(selectMeasurement);

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.PLACED_TOKEN, ItemTypes.STASHED_TOKEN],
    hover: (item, monitor) => {
      if (item.type !== ItemTypes.PLACED_TOKEN) return;

      const { x, y } = ref.current.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

      const position = { x: x + 24, y: y + 24 };

      if (ruler) {
        dispatch(movedTo(position));
      } else {
        dispatch(pathStarted(position));
      }

      mouseLocation.current = monitor.getSourceClientOffset();
      // console.info(`loc`, monitor.getInitialSourceClientOffset(), mouseLocation.current);
    },
    drop: (item, monitor) => {
      const { id, type } = item;

      const position = ref.current.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

      switch (type) {
        case ItemTypes.PLACED_TOKEN:
          dispatch(pathStopped());
          dispatch(tokenUpsertRequested({ id, position }));
          break;
        case ItemTypes.STASHED_TOKEN:
          dispatch(tokenUpsertRequested({ id, position }));
          break;
        case ItemTypes.GENERATOR:
          dispatch(tokenPlacementRequested({ id: nanoid(), group: id, position }));
          break;
        default:
      }
    },
    collect: (monitor, props) => console.log('collecting', monitor.isOver(), props),
  });

  return (
    <div className="map-layer-wrapper">
      <RulerOverlay ref={ref}>
        <div ref={drop} className="map-layer">
          <MapImage />
          <TokenLayer />
        </div>
      </RulerOverlay>
    </div>
  );
}
