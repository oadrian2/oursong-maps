import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { Point, Token } from '../api/types';
import { isControlledGeneratorState } from '../app/mapState';
import { isSelfMovingState } from '../app/rulerState';
import { activeTokenIDsState, fullTokenState, selectedTokenIdState, tokenState } from '../app/tokenState';
import { PlacedToken } from './PlacedToken';
import { TokenFlyout } from './TokenFlyout';
import { TokenMenu } from './TokenMenu';

export function TokenLayer() {
  const tokenIDs = useRecoilValue(activeTokenIDsState);

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {tokenIDs.map((id) => (
        <motion.div key={id} variants={variants} initial="hidden" animate="visible" exit="hidden">
          <AnimatedPlacedToken id={id} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function AnimatedPlacedToken({ id }: AnimatedPlacedTokenProps) {
  const [selectedTokenId, setSelectedTokenId] = useRecoilState(selectedTokenIdState);

  const { position, path: targetPath, generator } = useRecoilValue(tokenState(id))!;

  const isClaimed = useRecoilValue(isControlledGeneratorState(generator));
  const isSelected = selectedTokenId === id;

  const controls = useAnimation();

  const isMoving = useRecoilValue(isSelfMovingState);

  useEffect(() => {
    if (!position) return;

    const segments = targetPath?.length !== 0 ? targetPath : [position, position];

    const xCoords = segments.map(({ x }: Point) => x);
    const yCoords = segments.map(({ y }: Point) => y);

    controls.start({ left: xCoords, top: yCoords });

    // return () => controls.stop();
  }, [targetPath, position, controls]);

  const handleTokenClick = useCallback(() => {
    if (!isClaimed) return;

    setSelectedTokenId(id);
  }, [setSelectedTokenId, id, isClaimed]);

  const token = useRecoilValue(fullTokenState(id))!;

  const patchToken = useRecoilCallback(({ snapshot, set }) => async (patch: Partial<Token>) => {
    const token = await snapshot.getPromise(tokenState(id));

    set(tokenState(id), { ...token, ...patch, path: [] });
  }, [id]);

  const handleFlyoutClose = useCallback((patch: Partial<Token>) => {
    if (patch.notes === token.notes && patch.tags?.length === token.tags?.length && patch.tags?.every(pi => token.tags?.includes(pi))) return;

    patchToken(patch);
  }, [token, patchToken]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 100 : undefined,
      }}
    >
      <PlacedToken id={id} onClick={handleTokenClick} isSelected={isSelected} />
      <TokenMenu id={id} showMenu={isSelected && !isMoving} />
      <TokenFlyout show={isSelected && !isMoving} fullToken={token} onClose={handleFlyoutClose} />
    </motion.div>
  );
}

type AnimatedPlacedTokenProps = { id: string };


