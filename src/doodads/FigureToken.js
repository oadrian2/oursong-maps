import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef } from 'react';
import { TokenAllegiance } from '../map/tokenSlice';
import './FigureToken.css';

export const FigureToken = forwardRef(({ isTemplate, index, prefix, label, allegiance, isGroup, overlay, angle = -Math.PI / 2 }, ref) => {
  const allegianceClass =
    {
      [TokenAllegiance.ALLY]: 'token--ally',
      [TokenAllegiance.ENEMY]: 'token--enemy',
      [TokenAllegiance.TARGET]: 'token--target',
    }[allegiance] || 'token-unknown';

  if (isTemplate) {
    const effectiveLabel = `${prefix}${isGroup ? '#' : ''}`;
    const effectiveTitle = label;

    return (
      <RoundToken ref={ref} title={effectiveTitle} allegianceClass={allegianceClass}>
        {effectiveLabel}
      </RoundToken>
    );
  } else {
    // Group tokens present as Ab1, Ab2, Ab3, etc.
    // Leader (non-group) tokens present as Ab, Ab1, Ab2, etc where Ab1, Ab2 are subordinates.
    const effectiveLabel = `${prefix}${isGroup ? index + 1 : index || ''}`;
    const effectiveTitle = `${label} ${isGroup ? index + 1 : index || ''}`;

    return (
      <RoundToken ref={ref} title={effectiveTitle} allegianceClass={allegianceClass}>
        {effectiveLabel}
        {overlay && <Overlay>{overlay}</Overlay>}
      </RoundToken>
    );
  }
});

FigureToken.displayName = 'FigureToken';

const RoundToken = forwardRef(({ children, title, allegianceClass }, ref) => {
  return (
    <div className={`token ${allegianceClass}`} ref={ref} title={title}>
      {children}
    </div>
  );
});

RoundToken.displayName = 'RoundToken';

export function Overlay({ children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.87 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="overlay"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
