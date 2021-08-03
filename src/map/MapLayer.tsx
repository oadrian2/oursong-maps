import styled from '@emotion/styled';
import { Switch } from '@material-ui/core';
import { nanoid } from 'nanoid';
import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import { GeneratorID } from '../app/mapState';
import { Point } from '../app/math';
import { viewInactiveState } from '../app/state';
import { selectedTokenIdState, TokenID, tokenIDsState, tokenState } from '../app/tokenState';
import { ItemTypes } from '../ItemTypes';
import { RulerOverlay, RulerOverlayHandle } from '../ruler/RulerOverlay';
import { MapImage } from './MapImage';
import { TokenLayer } from './TokenLayer';

const TOKEN_SIZE = 48.0;
const TOKEN_MIDPOINT = TOKEN_SIZE / 2;
const atMidpoint = ({ x, y }: Point) => ({ x: x + TOKEN_MIDPOINT, y: y + TOKEN_MIDPOINT });

export function MapLayer() {
  const ref = useRef<RulerOverlayHandle>(null);

  const [viewInactive, setViewInactive] = useRecoilState(viewInactiveState);
  const setSelectedTokenId = useSetRecoilState(selectedTokenIdState);

  const unstashToken = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ id, position }: { id: TokenID; position: Point }) => {
        const midpointPosition = atMidpoint(position);

        const token = await snapshot.getPromise(tokenState(id));

        set(tokenState(id), { ...token, position: midpointPosition, path: null, facing: null });
      },
    []
  );

  const placeToken = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ id, position, generator }: { id: TokenID; position: Point; generator: GeneratorID }) => {
        const midpointPosition = atMidpoint(position);

        const tokenIDs = await snapshot.getPromise(tokenIDsState);

        set(tokenState(id), { position: midpointPosition, generator });
        set(tokenIDsState, [...tokenIDs, id]);
      }
  );

  const [, drop] = useDrop({
    accept: [ItemTypes.GENERATOR, ItemTypes.STASHED_TOKEN],
    drop: (item: { id: string; type: string }, monitor) => {
      const { id, type } = item;

      const position = ref.current!.clientCoordinatesToMapCoordinates(monitor.getSourceClientOffset()!);

      switch (type) {
        case ItemTypes.STASHED_TOKEN:
          unstashToken({ id, position });
          break;
        case ItemTypes.GENERATOR:
          placeToken({ id: nanoid(), position, generator: id });
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
