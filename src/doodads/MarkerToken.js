import { forwardRef } from 'react';
import './MarkerToken.css';

export const MarkerToken = forwardRef(({ color, effectRadius, title }, ref) => {
  return (
    <div className="marker-token" ref={ref} title={title}>
      <img src={`/marker-${color}-512.png`} draggable="false" style={{ width: 32 }} alt={title} />
    </div>
  );
});

MarkerToken.displayName = 'MarkerToken';
