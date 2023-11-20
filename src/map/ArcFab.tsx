/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fab } from '@mui/material';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { roundToMultiple } from '../app/math';

const TOKEN_SIZE = 48;

export function ArcFab({ children, angle, 'aria-label': label, onClick = () => {} }: ArcFabProps) {
  const startDistance = TOKEN_SIZE * 0.25;
  const endDistance = TOKEN_SIZE * 1.5;
  const step = 0.001;

  const startX = roundToMultiple(Math.cos(angle) * startDistance, step);
  const startY = roundToMultiple(Math.sin(angle) * startDistance, step);

  const endX = roundToMultiple(Math.cos(angle) * endDistance, step);
  const endY = roundToMultiple(Math.sin(angle) * endDistance, step);
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
      <Fab color="primary" size="small" onClick={onClick} component="button" aria-label={label} onMouseDown={stopPropogation} onMouseUp={stopPropogation}>
        {children}
      </Fab>
    </motion.div>
  );
}

export type ArcFabProps = {
  children: NonNullable<ReactNode>;
  angle: number;
  'aria-label'?: string;
  onClick: React.EventHandler<React.SyntheticEvent>;
};
