import styled from '@emotion/styled';
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

  // const [measuring, setMeasuring] = useState(false);

  // const [selectedTokenID, setSelectedTokenID] = useRecoilState(selectedTokenIdState);
  // const hoveredTokenID = useRecoilValue(hoveredTokenIdState);
  const setSelectedTokenID = useSetRecoilState(selectedTokenIdState);

  const { position: hoveredPosition } = useRecoilValue(trackedPositionState) ?? { position: null };

  const [, { start, stop, complete, moveTo, pushWaypoint, popWaypoint }] = useRuler();

  const measuring = useRecoilValue(isMeasuringState);

  useImperativeHandle(ref, () => ({
    clientCoordinatesToMapCoordinates: ({ x, y }: XYCoord) => clientCoordinatesToMapCoordinates(containerRef.current!, { x, y }),
  }));

  function onMouseDown(event: React.MouseEvent) {
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

    // if (event.button !== 2) return;

    // if (measuring) return;

    // setMeasuring(true);

    // const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

    // start(position, hoveredPosition, selectedTokenID === hoveredTokenID ? selectedTokenID : null);
  }

  function onMouseUp() {
    if (!measuring) return;

    // setMeasuring(false);

    // complete();
  }

  const onMouseMove = useCallback(function onMouseMove(event: React.MouseEvent) {
    if (!measuring) return;

    const position = clientCoordinatesToMapCoordinates(containerRef.current!, { x: event.pageX, y: event.pageY });

    moveTo(position);
  }, [measuring, containerRef, moveTo]);

  function onKeyUp(event: React.KeyboardEvent) {
    if (event.code === 'Escape') {
      setSelectedTokenID(null);

      if (!measuring) return;

      // setMeasuring(false);

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
    <RulerOverlayWrapper
      ref={containerRef!}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onKeyUp={onKeyUp}
      tabIndex={0}
    >
      {children}
      <Rulers />
    </RulerOverlayWrapper>
  );
});

RulerOverlay.displayName = 'RulerOverlay';

type RulerOverlayProps = { children: ReactNode };

export const RulerOverlayWrapper = styled.div`
  display: flex;

  border: 2px solid black;

  margin-inline: auto;

  width: min-content;

  position: relative;

  user-select: none;

  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

RulerOverlayWrapper.displayName = 'RulerOverlayWrapper';
