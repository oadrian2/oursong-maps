import React from 'react';

export const PlacedDoodad = React.forwardRef(function ({ position, children }, ref) {
  return <div ref={ref} style={{ position: 'absolute', left: position.x, top: position.y, transition: 'left .5s, top .5s' }}>{children}</div>;
});
