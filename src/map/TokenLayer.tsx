import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Point } from '../api/types';
import { isControlledGeneratorState } from '../app/mapState';
import { isSelfMovingState } from '../app/rulerState';
import { activeTokenIDsState, selectedTokenIdState, tokenState } from '../app/tokenState';
import { PlacedToken } from './PlacedToken';
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
    </motion.div>
  );
}

type AnimatedPlacedTokenProps = { id: string };
