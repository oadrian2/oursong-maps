import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Point } from '../app/math';
import { RootState } from '../app/store';
import { selectClaimedGeneratorIds } from '../supply/generatorsSlice';
import { PlacedToken } from './PlacedToken';
import { selectFocusedTokenId, selectSelectedTokenId, tokenSelected } from './selectionSlice';
import { TokenMenu } from './TokenMenu';
import { selectActiveTokens, selectTokenById } from './tokenSlice';

export function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {tokens.map(({ id }) => (
        <motion.div key={id} variants={variants} initial="hidden" animate="visible" exit="hidden">
          <AnimatedPlacedToken id={id} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function AnimatedPlacedToken({ id }: AnimatedPlacedTokenProps) {
  const dispatch = useDispatch();

  const { position, path: targetPath, generator } = useSelector((state: RootState) => selectTokenById(state, id))!;

  const focusedId = useSelector(selectFocusedTokenId);
  const selectedId = useSelector(selectSelectedTokenId);

  const claimed = useSelector(selectClaimedGeneratorIds);

  const isClaimed = claimed.includes(generator);
  const isSelected = selectedId === id;
  const isFocused = focusedId === id;

  const controls = useAnimation();

  useEffect(() => {
    if (!position) return;

    const segments = targetPath || [position, position];

    const xCoords = segments.map(({ x }: Point) => x);
    const yCoords = segments.map(({ y }: Point) => y);

    controls.start({
      left: xCoords,
      top: yCoords,
    });

    // return () => controls.stop();
  }, [targetPath, position, controls]);

  const onClick = useCallback(() => {
    if (!isClaimed) return;

    dispatch(tokenSelected(id));
  }, [dispatch, id, isClaimed]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: isFocused || isSelected ? 100 : undefined,
      }}
    >
      <PlacedToken id={id} onClick={onClick} />
      <AnimatePresence>{isSelected && <TokenMenu id={id} />}</AnimatePresence>
    </motion.div>
  );
}

type AnimatedPlacedTokenProps = { id: string };
