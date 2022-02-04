/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fab } from '@mui/material';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { roundToStep } from '../app/math';

const TOKEN_SIZE = 48;

export function ArcFab({ children, angle, onClick = () => {} }: ArcFabProps) {
  const startDistance = TOKEN_SIZE * 0.25;
  const endDistance = TOKEN_SIZE * 1.5;
  const step = 0.001;

  const startX = roundToStep(Math.cos(angle) * startDistance, step);
  const startY = roundToStep(Math.sin(angle) * startDistance, step);

  const endX = roundToStep(Math.cos(angle) * endDistance, step);
  const endY = roundToStep(Math.sin(angle) * endDistance, step);
  const delay = 0.1;

  const variants: any = {
    hidden: {
      opacity: 0,
      transform: `translate(${+startX}px, ${-startY}px)`,
      transition: { delay },
      pointerEvents: 'none',
    },
    visible: {
      opacity: 1,
      transform: `translate(${+endX}px, ${-endY}px)`,
      transitionEnd: { pointerEvents: 'all' },
    },
  };

  const stopPropogation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      css={css`
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        z-index: 100;
      `}
    >
      <Fab color="primary" size="small" onClick={onClick} component="button" onMouseDown={stopPropogation} onMouseUp={stopPropogation}>
        {children}
      </Fab>
    </motion.div>
  );
}

export type ArcFabProps = {
  children: NonNullable<ReactNode>;
  angle: number;
  onClick: React.EventHandler<React.SyntheticEvent>;
};
