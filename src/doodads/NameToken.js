import { forwardRef } from 'react';
import './NameToken.css';

export const NameToken = forwardRef(({ label, title, allegiance }, ref) => {
  const className =
    {
      [TokenAllegiance.ALLY]: 'token--ally',
      [TokenAllegiance.ENEMY]: 'token--enemy',
    }[allegiance] || 'token-unknown';

  return (
    <div className={`token ${className}`} ref={ref} title={title}>
      <div className="token__circle">
        <span className="token__label">{label}</span>
      </div>
    </div>
  );
});

NameToken.displayName = 'NameToken';

export const TokenAllegiance = {
  UNKNOWN: 'unknown',
  ALLY: 'ally',
  ENEMY: 'enemy',
};
