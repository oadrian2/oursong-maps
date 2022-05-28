import { Box, Switch } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import { GeneratorID, ItemTypes, Point, TokenID } from '../api/types';
import { viewInactiveState } from '../app/mapState';
import { selectedTokenIdState, tokenIDsState, tokenState } from '../app/tokenState';
import { isGMState } from '../app/userState';
import SkullIcon from '../icons/Skull';
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

        set(tokenState(id), { ...token, position: midpointPosition, path: [], facing: null });
      },
    []
  );

  const placeToken = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ id, position, generator }: { id: TokenID; position: Point; generator: GeneratorID }) => {
        const midpointPosition = atMidpoint(position);

        const tokenIDs = await snapshot.getPromise(tokenIDsState);
        const isGM = await snapshot.getPromise(isGMState);

        set(tokenState(id), {
          position: midpointPosition,
          facing: null,
          generator,
          deleted: false,
          active: true,
          visible: !isGM,
          path: [],
          notes: '',
          tags: [],
        });
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
          <React.Suspense
            fallback={<Box sx={{ boxShadow: 3, m: 1, position: 'fixed', top: '50%', left: '50%', background: 'white' }}>Loading...</Box>}
          >
            <TokenLayer />
          </React.Suspense>
        </div>
      </RulerOverlay>
      <Box position="fixed" right="2rem" top="5rem">
        <Box display="flex" alignItems="center">
          <SkullIcon sx={{ width: 40, height: 40 }} />
          <Switch checked={viewInactive} onChange={handleViewInactiveChange} />
        </Box>
      </Box>
    </>
  );
}
