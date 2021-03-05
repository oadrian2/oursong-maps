import { forwardRef } from 'react';
import './MarkerToken.css';

const CELL_SIZE = 48.0;

export const MarkerToken = forwardRef(({ color, effectRadius, title }, ref) => {
  const tokenClass = `marker-token marker-token--${color}`;

  return (
    <div className={tokenClass} ref={ref} title={title}>
      <div className="marker-token__placemat"></div>
      <div className="marker-token__aura" style={{ width: CELL_SIZE * effectRadius, height: CELL_SIZE * effectRadius }}></div>
      <img src={`/marker-${color}-512.png`} className="marker-token__image" draggable="false" alt={title} />
    </div>
  );
});

MarkerToken.displayName = 'MarkerToken';
