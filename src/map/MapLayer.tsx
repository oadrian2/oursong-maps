import styled from '@emotion/styled';
import { Switch } from '@material-ui/core';
import { nanoid } from '@reduxjs/toolkit';
import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay, RulerOverlayHandle } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import { selectedTokenIdState, viewInactiveState } from './State';
import { TokenLayer } from './TokenLayer';
import { tokenPlacementRequested, unstashTokenToRequested } from './tokenSlice';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef<RulerOverlayHandle>(null);

  const [viewInactive, setViewInactive] = useRecoilState(viewInactiveState);
  const setSelectedTokenId = useSetRecoilState(selectedTokenIdState);

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.STASHED_TOKEN],
    drop: (item: { id: string; type: string }, monitor) => {
      const { id, type } = item;

      const position = ref.current!.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset()!);

      switch (type) {
        case ItemTypes.STASHED_TOKEN:
          dispatch(unstashTokenToRequested({ id, position }));
          break;
        case ItemTypes.GENERATOR:
          dispatch(tokenPlacementRequested({ id: nanoid(), generator: id, position }));
          break;
        default:
      }
    },
  });

  const handleViewInactiveChange = (event: React.ChangeEvent<HTMLInputElement>) => setViewInactive(event.target.checked);
  const handleMapImageClick = useCallback(() => setSelectedTokenId(null), [setSelectedTokenId]);

  return (
    <>
      <RulerOverlay ref={ref}>
        <div ref={drop}>
          <MapImage onClick={handleMapImageClick} />
          <TokenLayer />
        </div>
      </RulerOverlay>
      <MapCommandConsole>
        <Switch checked={viewInactive} onChange={handleViewInactiveChange} />
      </MapCommandConsole>
    </>
  );
}

export const MapCommandConsole = styled.div`
  position: fixed;
  right: 2rem;
  top: 5rem;
`;
