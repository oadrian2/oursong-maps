import styled from '@emotion/styled';
import React, { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { selectSelectedTokenId, tokenDeselected } from '../map/selectionSlice';
import { selectTokenById } from '../map/tokenSlice';
import { selectClaimedGeneratorIds } from '../supply/generatorsSlice';
import { Rulers } from './Rulers';
import { movedTo, pathCompleted, pathStarted, pathStopped, pointPopped, pointPushed, requestUpdateRemoteRuler } from './rulerSlice';

function clientCoordinatesToMapCoordinates(element: HTMLElement, position: XYCoord) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: clientX - containerLeft + scrollLeft, y: clientY - containerTop + scrollTop };
}

export const RulerOverlay = forwardRef(({ children }: RulerOverlayProps, ref) => {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  const [measuring, setMeasuring] = useState(false);
  const [moving, setMoving] = useState(false);

  // const { origin, points } = useSelector(selectOwnRuler);
  const activeTokenId = useSelector(selectSelectedTokenId);
  const { generator: activeGenerator } = useSelector((state: RootState) => selectTokenById(state, activeTokenId!)) || {};
  const claimedGenerators = useSelector(selectClaimedGeneratorIds);

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }: XYCoord) => clientCoordinatesToMapCoordinates(containerRef.current!, { x, y }),
  }));

  function onMouseDown(event: React.MouseEvent) {
    if (event.button !== 2) return;

    if (measuring) return;

    setMeasuring(true);

    if (!!activeTokenId && claimedGenerators.includes(activeGenerator!)) {
      setMoving(true);
    }

    const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

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

    dispatch(pathStopped());
    dispatch(requestUpdateRemoteRuler());
  }

  function onMouseMove(event: React.MouseEvent) {
    if (!measuring) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

    dispatch(movedTo(position));
    dispatch(requestUpdateRemoteRuler());
  }

  function onKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Escape') {
      dispatch(tokenDeselected(null));

      if (!measuring) return;

      setMeasuring(false);
      setMoving(false);

      dispatch(pathStopped());
      dispatch(requestUpdateRemoteRuler());
    }

    if (event.code === 'KeyW') dispatch(pointPushed());
    if (event.code === 'KeyQ') dispatch(pointPopped());
  }

  return (
    <RulerOverlayWrapper
      ref={containerRef!}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyUp={onKeyUp}
      tabIndex={0}
    >
      {children}
      <Rulers isMoving={moving} />
    </RulerOverlayWrapper>
  );
});

RulerOverlay.displayName = 'RulerOverlay';

type RulerOverlayProps = { children: ReactNode };

export const RulerOverlayWrapper = styled.div`
  display: flex;

  border: 2px solid black;

  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;

  width: min-content;

  position: relative;

  user-select: none;

  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

RulerOverlayWrapper.displayName = 'RulerOverlayWrapper';
