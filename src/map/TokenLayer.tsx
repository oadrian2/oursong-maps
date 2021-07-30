import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Point } from '../app/math';
import { PlacedToken } from './PlacedToken';
import { activeTokenIDsState, isControlledGeneratorState, selectedTokenIdState, tokenState } from './State';
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

  useEffect(() => {
    if (!position) return;

    const segments = targetPath || [position, position];

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
      <PlacedToken id={id} onClick={handleTokenClick} />
      <AnimatePresence>{isSelected && <TokenMenu id={id} />}</AnimatePresence>
    </motion.div>
  );
}

type AnimatedPlacedTokenProps = { id: string };
