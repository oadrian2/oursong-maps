import { nanoid } from '@reduxjs/toolkit';
import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import Draggable from 'react-draggable';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Token from '../doodads/Token';
import { selectActiveTokens, tokenPlacementRequested, tokenUpsertRequested } from '../doodads/tokenSlice';
import { ItemTypes } from '../ItemTypes';
import { Measurement } from '../measurement/Measurement';
import { movedTo, pathStarted, pathStopped, pointPopped, pointPushed, selectPathAsVectors } from '../measurement/measurementSlice';
import MapImage from './MapImage';
import './MapLayer.css';
import { PlacedDoodad } from './PlacedDoodad';

function clientCoordinatesToMapCoordinates(element, position, scale) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: (clientX - containerLeft + scrollLeft) / scale, y: (clientY - containerTop + scrollTop) / scale };
}

export default function MapLayer() {
  const dispatch = useDispatch();

  const vectors = useSelector(selectPathAsVectors);
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  console.log(tokens);

  const ref = useRef();

  const [scale] = useState(1);

  function onMouseDown(event) {
    if (event.buttons !== 1 || !event.shiftKey) return; // only shift + left-click

    const position = clientCoordinatesToMapCoordinates(ref.current, { x: event.pageX, y: event.pageY }, scale);

    dispatch(pathStarted(position));
  }

  function onMouseUp() {
    if (!vectors.length) return;

    dispatch(pathStopped());
  }

  function onMouseMove(event) {
    if (!vectors.length) return;

    const position = clientCoordinatesToMapCoordinates(ref.current, { x: event.pageX, y: event.pageY }, scale);

    dispatch(movedTo(position));
  }

  function onKeyPress(event) {
    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  const [, drop] = useDrop({
    accept: [ItemTypes.TOKEN, ItemTypes.TOKEN_GROUP],
    drop: (item, monitor) => {
      const { id, type, shape } = item;

      const position = clientCoordinatesToMapCoordinates(ref.current, monitor.getSourceClientOffset(), scale);

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
    <div
      ref={ref}
      className="map-layer-wrapper"
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyPress={onKeyPress}
      tabIndex="0"
    >
      <div ref={drop} className="map-layer" style={{ transform: `scale(${scale})` }}>
        <MapImage />
        {tokens.map(({ id, position }) => (
          <PlacedDoodad key={id} position={position}>
            <Token id={id} />
          </PlacedDoodad>
        ))}
        {vectors.map(({ start, end }, index) => (
          <Measurement key={index} start={start} end={end} showRadius={vectors.length === 1} />
        ))}
      </div>
    </div>
  );
}

export function Drag({ position }) {
  const ref = useRef();

  return (
    <Draggable onDrag={(event, data) => console.log(data)} defaultPosition={position} nodeRef={ref}>
      <div ref={ref} style={{ width: 60, height: 60, background: 'black', color: 'white', position: 'absolute', left: 0, top: 0 }}>
        Hi there
      </div>
    </Draggable>
  );
}
