/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Fab } from '@material-ui/core';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

const TOKEN_SIZE = 48;
const TOKEN_MIDPOINT = TOKEN_SIZE / 2;

export function ArcFab({ children, angle, onClick = () => {} }: ArcFabProps) {
  const startDistance = 0;
  const endDistance = TOKEN_SIZE * 1.5;

  const startX = Math.cos(angle) * startDistance;
  const startY = Math.sin(angle) * startDistance;

  const endX = Math.cos(angle) * endDistance;
  const endY = Math.sin(angle) * endDistance;
  const delay = 0.3;

  const variants: any = {
    hidden: {
      opacity: 0,
      left: TOKEN_MIDPOINT + startX,
      top: TOKEN_MIDPOINT - startY,
      transition: { delay },
      pointerEvents: 'none',
    },
    visible: {
      opacity: 1,
      left: TOKEN_MIDPOINT + endX,
      top: TOKEN_MIDPOINT - endY,
      transition: { delay },
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
        transform: translate(-50%, -50%);
        position: absolute;
        z-index: 100;
      `}
    >
      <Fab
        color="primary"
        size="small"
        onClick={onClick}
        component="button"
        onMouseDown={stopPropogation}
        onMouseUp={stopPropogation}
      >
        {children}
      </Fab>
    </motion.div>
  );
}

export type ArcFabProps = { children: NonNullable<ReactNode>; angle: number; onClick: React.EventHandler<React.SyntheticEvent> };
