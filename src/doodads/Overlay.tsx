/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export function Overlay({ children }: OverlayProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.87 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        css={css`
          display: grid;
          place-content: center;

          width: 100%;
          height: 100%;

          position: absolute;
          top: 0;
          left: 0;

          color: white;

          font-size: 16px;
          font-weight: 500;

          background: black;
          color: white;

          pointer-events: none;

          @supports (backdrop-filter: blur(8px)) {
            background: transparent;
            backdrop-filter: blur(8px);
          }
        `}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export type OverlayProps = { children: ReactNode };