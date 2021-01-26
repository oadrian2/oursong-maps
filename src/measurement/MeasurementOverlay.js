import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { movedTo, pathStarted, pathStopped, pointPopped, pointPushed, selectPathAsVectors } from '../measurement/measurementSlice';
import { Measurement } from './Measurement';
import './MeasurementOverlay.css';

function clientCoordinatesToMapCoordinates(element, position, scale) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: (clientX - containerLeft + scrollLeft) / scale, y: (clientY - containerTop + scrollTop) / scale };
}

const MeasurementOverlay = forwardRef(({ children }, ref) => {
  const dispatch = useDispatch();

  const vectors = useSelector(selectPathAsVectors);

  const [scale] = useState(1);

  const containerRef = useRef();

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }) => clientCoordinatesToMapCoordinates(containerRef.current, { x, y }, scale),
  }));

  function onMouseDown(event) {
    if (event.buttons !== 1 || !event.shiftKey) return; // only left-click

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY }, scale);

    dispatch(pathStarted(position));
  }

  function onMouseUp() {
    dispatch(pathStopped());
  }

  function onMouseMove(event) {
    if (!vectors.length) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY }, scale);

    dispatch(movedTo(position));
  }

  function onKeyPress(event) {
    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  return (
    <div
      ref={containerRef}
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
});

MeasurementOverlay.displayName = 'MeasurementOverlay';

export default MeasurementOverlay;
