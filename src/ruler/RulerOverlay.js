import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedTokenId, tokenDeselected } from '../map/selectionSlice';
import { selectTokenById } from '../map/tokenSlice';
import { selectClaimedGeneratorIds } from '../supply/generatorsSlice';
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
  const [moving, setMoving] = useState(false);

  // const { origin, points } = useSelector(selectOwnRuler);
  const activeTokenId = useSelector(selectSelectedTokenId);
  const { generator: activeGenerator } = useSelector((state) => selectTokenById(state, activeTokenId)) || {};
  const claimedGenerators = useSelector(selectClaimedGeneratorIds);

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }) => clientCoordinatesToMapCoordinates(containerRef.current, { x, y }),
  }));

  function onMouseDown(event) {
    if (event.button !== 2) return;

    if (measuring) return;

    setMeasuring(true);

    if (!!activeTokenId && claimedGenerators.includes(activeGenerator)) {
      setMoving(true);
    }

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(pathStarted(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseUp() {
    if (!measuring) return;

    setMeasuring(false);
    setMoving(false);

    if (moving) {
      dispatch(pathCompleted());
    }

    dispatch(pathStopped(null));
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseMove(event) {
    if (!measuring) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current, { x: event.pageX, y: event.pageY });

    dispatch(movedTo(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onKeyUp(event) {
    if (event.code === 'Escape') {
      dispatch(tokenDeselected(null));

      if (!measuring) return;

      setMeasuring(false);
      setMoving(false);

      dispatch(pathStopped(null));
      dispatch(requestUpdateRemoteRuler());
    }

    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  return (
    <div
      ref={containerRef}
      className="ruler-overlay"
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyUp={onKeyUp}
      tabIndex="0"
    >
      {children}
      <Rulers isMoving={moving} />
    </div>
  );
});

RulerOverlay.displayName = 'RulerOverlay';
