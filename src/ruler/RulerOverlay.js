import { forwardRef, useImperativeHandle, useRef, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './RulerOverlay.css';
import { movedTo, pathStarted, pathStopped, pointPopped, pointPushed, requestUpdateRemoteRuler, selectRulerMetrics } from './rulerSlice';

function clientCoordinatesToMapCoordinates(element, position) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: clientX - containerLeft + scrollLeft, y: clientY - containerTop + scrollTop };
}

export const RulerOverlay = forwardRef(({ children }, ref) => {
  const dispatch = useDispatch();

  const rulerMetrics = useSelector(selectRulerMetrics);

  const containerRef = useRef();

  const [measuring, setMeasuring] = useState(false);

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }) => clientCoordinatesToMapCoordinates(containerRef.current, { x, y }),
  }));

  function onMouseDown(event) {
    if (event.buttons !== 1 || !event.shiftKey) return; // only left-click
    if (measuring) return;

    setMeasuring(true);

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(pathStarted(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseUp() {
    if (!measuring) return;

    setMeasuring(false);

    dispatch(pathStopped());
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseMove(event) {
    if (!measuring) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(movedTo(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onKeyPress(event) {
    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  console.log(rulerMetrics.map(({ scaledX, scaledY }) => `x: ${scaledX}, y: ${scaledY}`)[0]);

  return (
    <div
      ref={containerRef}
      className="ruler-overlay"
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyPress={onKeyPress}
      tabIndex="0"
    >
      {children}
      {rulerMetrics.map(({ id, isSingle, origin, path, radius, lastPoint, lastLength, totalLength, scaledX, scaledY }) => (
        <Fragment key={id}>
          <svg className="measurement-layer">
            <defs>
              <marker id="arrowhead" markerUnits="strokeWidth" markerWidth="5" markerHeight="2.5" refX="5" refY="1.25" orient="auto">
                <polygon points="0 0, 5 1.25, 0 2.5" />
              </marker>
            </defs>
            <path d={path} className="back-stroke" markerEnd="url(#arrowhead)" />
            <path d={path} className="fore-stroke" markerEnd="url(#arrowhead)" />
            {isSingle && (
              <>
                <circle cx={origin.x} cy={origin.y} r={radius} className="back-stroke" />
                <circle cx={origin.x} cy={origin.y} r={radius} className="fore-stroke" />
              </>
            )}
            <path d={path} className="back-stroke" markerEnd="url(#arrowhead)" />
            <path d={path} className="fore-stroke" markerEnd="url(#arrowhead)" />
          </svg>
          <div
            className="measurement-lengths"
            style={{ left: lastPoint.x, top: lastPoint.y, transform: `translate(calc(-50% + (${scaledX})), calc(-50% + (${scaledY}))` }}
          >
            <div className="measurement-length">
              <strong>C:</strong>
              <span>{lastLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
            </div>
            <div className="measurement-length">
              <strong>T:</strong>
              <span>{totalLength.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} yd.</span>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
});

RulerOverlay.displayName = 'RulerOverlay';
