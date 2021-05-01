/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export function TokenBase({ children, title, color }) {
  const colorMap = {
    red: '#d32f2f',
    blue: '#1976d2',
    yellow: '#ffeb3b',
    green: '#00796b',
  };

  return (
    <div
      title={title}
      css={css`
        display: grid;
        place-content: center;

        width: 3rem;
        height: 3rem;

        position: relative;
        overflow: hidden;

        border: 2px solid ${colorMap[color] ?? 'gray'};
        border-radius: 50%;

        background: black;
        color: white;

        font-weight: 400;

        user-select: none;
      `}
    >
      {children}
    </div>
  );
}
