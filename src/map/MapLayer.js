import { nanoid } from '@reduxjs/toolkit';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay } from '../ruler/RulerOverlay';
import { movedTo, pathStarted, pathStopped, selectShowRuler } from '../ruler/rulerSlice';
import { MapImage } from './MapImage';
import './MapLayer.css';
import { TokenLayer } from './TokenLayer';
import { moveTokenToRequested, tokenPlacementRequested, unstashTokenToRequested } from './tokenSlice';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef();

  const ruler = useSelector(selectShowRuler);

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
    },
    canDrop: (item, monitor) => {
      console.log(item);
      return true;
    },
    drop: (item, monitor) => {
      const { id, type } = item;

      const position = ref.current.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

      switch (type) {
        case ItemTypes.PLACED_TOKEN:
          dispatch(pathStopped());
          dispatch(moveTokenToRequested({ id, position }));
          break;
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
