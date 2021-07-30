import styled from '@emotion/styled';
import React, { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react';
import { XYCoord } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { selectedTokenIdState } from '../map/State';
import { Rulers } from './Rulers';
import { movedTo, pathCompleted, pathStarted, pathStopped, pointPopped, pointPushed } from './rulerSlice';
import { useRuler } from './userRuler';

function clientCoordinatesToMapCoordinates(element: HTMLElement, position: XYCoord) {
  const { x: clientX, y: clientY } = position;
  const { scrollLeft, scrollTop } = element;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: clientX - containerLeft + scrollLeft, y: clientY - containerTop + scrollTop };
}

export type RulerOverlayHandle = { clientCoordinatesToMapCoordinates: (position: XYCoord) => XYCoord };

export const RulerOverlay = forwardRef<RulerOverlayHandle, RulerOverlayProps>(({ children }: RulerOverlayProps, ref) => {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  const [measuring, setMeasuring] = useState(false);
  const [moving, setMoving] = useState(false);

  const [selectedTokenId, setSelectedTokenId] = useRecoilState(selectedTokenIdState);

  const [, { start, stop, moveTo, pushWaypoint, popWaypoint }] = useRuler();

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }: XYCoord) => clientCoordinatesToMapCoordinates(containerRef.current!, { x, y }),
  }));

  function onMouseDown(event: React.MouseEvent) {
    if (event.button !== 2) return;

    if (measuring) return;

    setMeasuring(true);

    if (!!selectedTokenId) {
      setMoving(true);
    }

    const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

    start(position);

    dispatch(pathStarted(position));
  }

  function onMouseUp() {
    if (!measuring) return;

    setMeasuring(false);
    setMoving(false);

    if (moving) {
      dispatch(pathCompleted(selectedTokenId));
    }

    stop();

    dispatch(pathStopped());
  }

  function onMouseMove(event: React.MouseEvent) {
    if (!measuring) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

    moveTo(position);

    dispatch(movedTo(position));
  }

  function onKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Escape') {
      setSelectedTokenId(null);

      if (!measuring) return;

      setMeasuring(false);
      setMoving(false);

      stop();
      dispatch(pathStopped());
    }

    if (event.code === 'KeyW') {
      pushWaypoint();
      dispatch(pointPushed());
    }

    if (event.code === 'KeyQ') {
      popWaypoint();
      dispatch(pointPopped());
    }
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
