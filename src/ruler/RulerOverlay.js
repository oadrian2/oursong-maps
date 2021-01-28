import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { movedTo, pathStarted, pathStopped, pointPopped, pointPushed, selectMeasurement } from './rulerSlice';
import './RulerOverlay.css';

function clientCoordinatesToMapCoordinates(element, position) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: clientX - containerLeft + scrollLeft, y: clientY - containerTop + scrollTop };
}

export const RulerOverlay = forwardRef(({ children }, ref) => {
  const dispatch = useDispatch();

  const measurement = useSelector(selectMeasurement);

  const containerRef = useRef();

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }) => clientCoordinatesToMapCoordinates(containerRef.current, { x, y }),
  }));

  function onMouseDown(event) {
    if (event.buttons !== 1 || !event.shiftKey) return; // only left-click

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(pathStarted(position));
  }

  function onMouseUp() {
    dispatch(pathStopped());
  }

  function onMouseMove(event) {
    if (!measurement) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(movedTo(position));
  }

  function onKeyPress(event) {
    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  return (
    <div
      ref={containerRef}
      className="measurement-overlay"
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyPress={onKeyPress}
      tabIndex="0"
    >
      {children}
      {!!measurement && (
        <>
          <svg className="measurement-layer">
            <defs>
              <marker id="arrowhead" markerUnits="strokeWidth" markerWidth="5" markerHeight="2.5" refX="5" refY="1.25" orient="auto">
                <polygon points="0 0, 5 1.25, 0 2.5" />
              </marker>
            </defs>
            {measurement.isSingle && (
              <>
                <circle cx={measurement.origin.x} cy={measurement.origin.y} r={measurement.radius} className="back-stroke" />
                <circle cx={measurement.origin.x} cy={measurement.origin.y} r={measurement.radius} className="fore-stroke" />
              </>
            )}
            <path d={measurement.path} className="back-stroke" markerEnd="url(#arrowhead)" />
            <path d={measurement.path} className="fore-stroke" markerEnd="url(#arrowhead)" />
          </svg>
          <div className="measurement-lengths">
            <div className="measurement-length">
              <strong>L:</strong>
              <span>{measurement.lastLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
            </div>
            <div className="measurement-length">
              <strong>T:</strong>
              <span>{measurement.totalLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

RulerOverlay.displayName = 'RulerOverlay';
