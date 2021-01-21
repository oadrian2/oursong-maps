import './MeasurementOverlay.css';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Measurement } from './Measurement';
import { movedTo, pathAsVectorsSelector, pathStarted, pathStopped, pointPopped, pointPushed } from '../measurement/measurementSlice';
import './MapLayer.css';

function clientCoordinatesToMapCoordinates(element, position, scale) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: (clientX - containerLeft + scrollLeft) / scale, y: (clientY - containerTop + scrollTop) / scale };
}

export function MeasurementOverlay({ children }) {
  const dispatch = useDispatch();

  const vectors = useSelector(pathAsVectorsSelector);

  const ref = useRef();

  const [scale] = useState(1);

  function onMouseDown(event) {
    if (event.buttons !== 1 || !event.shiftKey) return; // only left-click

    const position = clientCoordinatesToMapCoordinates(ref.current, { x: event.pageX, y: event.pageY }, scale);

    dispatch(pathStarted(position));
  }

  function onMouseUp() {
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
      {children}
      {vectors.map(({ start, end }, index) => (
        <Measurement key={index} start={start} end={end} showRadius={vectors.length === 1} />
      ))}
    </div>
  );
}
