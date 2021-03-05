import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { PlacedToken } from './PlacedToken';
import { selectActiveTokens, selectMenuTokenId, selectTokenById } from './tokenSlice';

export function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {tokens.map(({ id }) => (
        <motion.div key={id} variants={variants} initial="hidden" exit="hidden" animate="visible">
          <AnimatedPlacedToken id={id} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function AnimatedPlacedToken({ id }) {
  const { position, path: targetPath } = useSelector((state) => selectTokenById(state, id));

  const controls = useAnimation();

  useEffect(() => {
    if (!position) return;

    const segments = targetPath || [position, position];

    const xCoords = segments.map(({ x }) => x);
    const yCoords = segments.map(({ y }) => y);

    controls.start({
      left: xCoords,
      top: yCoords,
    });

    // return () => controls.stop();
  }, [targetPath, position, controls]);

  const menuTokenId = useSelector(selectMenuTokenId);

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: id === menuTokenId ? 100 : 0,
      }}
    >
      <PlacedToken id={id} />
    </motion.div>
  );
}
