import React from 'react';

export const PlacedDoodad = ({ position, children }) => (
  <div style={{ position: 'absolute', left: position.x, top: position.y, transition: 'left .5s, top .5s' }}>{children}</div>
);
