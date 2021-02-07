import { forwardRef } from 'react';
import { TokenAllegiance } from '../map/tokenSlice';
import './FigureToken.css';

export const FigureToken = forwardRef(({ isTemplate, index, prefix, label, allegiance, isGroup }, ref) => {
  const allegianceClass =
    {
      [TokenAllegiance.ALLY]: 'token--ally',
      [TokenAllegiance.ENEMY]: 'token--enemy',
    }[allegiance] || 'token-unknown';

  function RoundToken({ label, title }) {
    return (
      <div className={`token ${allegianceClass}`} ref={ref} title={title}>
        <div className="token__circle">
          <span className="token__label">{label}</span>
        </div>
      </div>
    );
  }

  if (isTemplate) {
    const effectiveLabel = `${prefix}${isGroup ? '#' : ''}`;
    const effectiveTitle = label;

    return <RoundToken label={effectiveLabel} title={effectiveTitle} />;
  } else {
    // Group tokens present as Ab1, Ab2, Ab3, etc.
    // Leader (non-group) tokens present as Ab, Ab1, Ab2, etc where Ab1, Ab2 are subordinates.
    const effectiveLabel = `${prefix}${isGroup ? index + 1 : index || ''}`;
    const effectiveTitle = `${label} ${isGroup ? index + 1 : index || ''}`;

    return <RoundToken label={effectiveLabel} title={effectiveTitle} />;
  }
});

FigureToken.displayName = 'FigureToken';
