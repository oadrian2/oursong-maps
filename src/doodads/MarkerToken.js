import { forwardRef } from 'react';

export const MarkerToken = forwardRef(({ color, effectRadius, title }, ref) => {
  return (
    <div className="marker-token" ref={ref} title={title}>
      M
    </div>
  );
});

MarkerToken.displayName = 'MarkerToken';
