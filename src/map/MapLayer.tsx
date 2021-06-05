import styled from '@emotion/styled';
import { Switch } from '@material-ui/core';
import { nanoid } from '@reduxjs/toolkit';
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useRecoilState } from 'recoil';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import { viewInactiveState } from './State';
import { TokenLayer } from './TokenLayer';
import { tokenPlacementRequested, unstashTokenToRequested } from './tokenSlice';

export function MapLayer() {
  const dispatch = useDispatch();

  const ref = useRef<any>();

  const [viewInactive, setViewInactive] = useRecoilState(viewInactiveState);

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.STASHED_TOKEN],
    drop: (item: { id: string; type: string }, monitor) => {
      const { id, type } = item;

      const position = ref.current?.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset());

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewInactive(event.target.checked);
  };

  return (
    <>
      <RulerOverlay ref={ref}>
        <div ref={drop}>
          <MapImage />
          <TokenLayer />
        </div>
      </RulerOverlay>
      <MapCommandConsole>
        <Switch checked={viewInactive} onChange={handleChange} />
      </MapCommandConsole>
    </>
  );
}

export const MapCommandConsole = styled.div`
  position: fixed;
  right: 2rem;
  top: 5rem;
`;
