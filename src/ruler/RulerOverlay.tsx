import { styled } from '@mui/material';
import React, { forwardRef, ReactNode, useCallback, useImperativeHandle, useRef } from 'react';
import { XYCoord } from 'react-dnd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { trackedPositionState } from '../app/mapState';
import { isMeasuringState } from '../app/rulerState';
import { selectedTokenIdState } from '../app/tokenState';
import { Rulers } from './Rulers';
import { useRuler } from './useRuler';

function clientCoordinatesToMapCoordinates(element: HTMLElement, position: XYCoord) {
  const { x: clientX, y: clientY } = position;
  const { left: containerLeft, top: containerTop } = element.getBoundingClientRect();

  return { x: clientX - containerLeft, y: clientY - containerTop };
}

export type RulerOverlayHandle = { clientCoordinatesToMapCoordinates: (position: XYCoord) => XYCoord };

export const RulerOverlay = forwardRef<RulerOverlayHandle, RulerOverlayProps>(({ children }: RulerOverlayProps, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const setSelectedTokenID = useSetRecoilState(selectedTokenIdState);

  const { position: hoveredPosition } = useRecoilValue(trackedPositionState) ?? { position: null };

  const [, { start, stop, complete, moveTo, pushWaypoint, popWaypoint }] = useRuler();

  const measuring = useRecoilValue(isMeasuringState);

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }: XYCoord) => clientCoordinatesToMapCoordinates(containerRef.current!, { x, y }),
  }));

  function handleMouseDown(event: React.MouseEvent) {
    if (measuring && event.button === 0) {
      complete();

      return;
    }

    if (measuring && event.button === 2) {
      pushWaypoint();

      return;
    }

    if (!measuring && event.button === 2) {
      const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

      start(position, hoveredPosition, null);
    }
  }

  const handleMouseMove = useCallback(
    function onMouseMove(event: React.MouseEvent) {
      if (!measuring) return;

      const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

      moveTo(position);
    },
    [measuring, containerRef, moveTo]
  );

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Escape') {
      setSelectedTokenID(null);

      if (!measuring) return;

      stop();
    }

    if (event.code === 'KeyW') {
      pushWaypoint();
    }

    if (event.code === 'KeyQ') {
      popWaypoint();
    }
  }

  return (
    <RulerOverlayWrapper ref={containerRef!} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onKeyUp={handleKeyUp} tabIndex={0}>
      {children}
      <Rulers />
    </RulerOverlayWrapper>
  );
});

RulerOverlay.displayName = 'RulerOverlay';

type RulerOverlayProps = { children: ReactNode };

const RulerOverlayWrapper = styled('div')`
  display: flex;

  border: 2px solid black;

  margin-inline: auto;

  width: min-content;

  position: relative;

  user-select: none;

  box-shadow: ${({ theme }) => theme.shadows[3]};
`;

RulerOverlayWrapper.displayName = 'RulerOverlayWrapper';
