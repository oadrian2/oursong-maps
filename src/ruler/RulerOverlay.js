import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import './RulerOverlay.css';
import { Rulers } from './Rulers';
import { movedTo, pathCompleted, pathStarted, pathStopped, pointPopped, pointPushed, requestUpdateRemoteRuler } from './rulerSlice';

function clientCoordinatesToMapCoordinates(element, position) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: clientX - containerLeft + scrollLeft, y: clientY - containerTop + scrollTop };
}

export const RulerOverlay = forwardRef(({ children }, ref) => {
  const dispatch = useDispatch();

  const containerRef = useRef();

  const [measuring, setMeasuring] = useState(false);

  // const { origin, points } = useSelector(selectOwnRuler);

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }) => clientCoordinatesToMapCoordinates(containerRef.current, { x, y }),
  }));

  function onMouseDown(event) {
    // if (event.buttons !== 1 || !event.shiftKey) return; // only left-click
    if (measuring) return;

    setMeasuring(true);

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(pathStarted(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseUp() {
    if (!measuring) return;

    setMeasuring(false);

    dispatch(pathCompleted());
    // dispatch(pathStopped([origin, ...points]));
    dispatch(pathStopped(null));
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseMove(event) {
    if (!measuring) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(movedTo(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onKeyPress(event) {
    if (!measuring) return;

    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  function onKeyUp(event) {
    if (!measuring) return;

    if (event.code === 'Escape') {
      setMeasuring(false);

      dispatch(pathStopped(null));
      dispatch(requestUpdateRemoteRuler());
    }
  }

  return (
    <div
      ref={containerRef}
      className="ruler-overlay"
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
      tabIndex="0"
    >
      {children}
      <Rulers />
    </div>
  );
});

RulerOverlay.displayName = 'RulerOverlay';
