import React from 'react';

const ImageToken = React.forwardRef(({ label, href }, ref) => {
  return (
    <div ref={ref} className="token">
      <div className="token__circle">
        <span className="token__label">{label}</span>
      </div>
    </div>
  );
});

export default ImageToken;
