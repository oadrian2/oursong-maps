import { forwardRef } from 'react';
import { TokenAllegiance } from '../map/tokenSlice';
import './FigureToken.css';

export const FigureToken = forwardRef(({ isTemplate, index, prefix, label, allegiance, isGroup, overlay }, ref) => {
  const allegianceClass =
    {
      [TokenAllegiance.ALLY]: 'token--ally',
      [TokenAllegiance.ENEMY]: 'token--enemy',
    }[allegiance] || 'token-unknown';

  if (isTemplate) {
    const effectiveLabel = `${prefix}${isGroup ? '#' : ''}`;
    const effectiveTitle = label;

    return <RoundToken ref={ref} label={effectiveLabel} title={effectiveTitle} allegianceClass={allegianceClass} />;
  } else {
    // Group tokens present as Ab1, Ab2, Ab3, etc.
    // Leader (non-group) tokens present as Ab, Ab1, Ab2, etc where Ab1, Ab2 are subordinates.
    const effectiveLabel = `${prefix}${isGroup ? index + 1 : index || ''}`;
    const effectiveTitle = `${label} ${isGroup ? index + 1 : index || ''}`;

    return (
      <RoundToken
        ref={ref}
        label={effectiveLabel}
        title={effectiveTitle}
        allegianceClass={allegianceClass}
        overlay={overlay}
      />
    );
  }
});

FigureToken.displayName = 'FigureToken';

const RoundToken = forwardRef(({ label, title, scale, allegianceClass, overlay }, ref) => {
  return (
    <div className={`token ${allegianceClass}`} ref={ref} title={title}>
      <span className="token__label" draggable="false">
        {label}
      </span>
      <div className={`token__overlay ${overlay ? 'visible' : ''}`}>{overlay}</div>
    </div>
  );
});

RoundToken.displayName = 'RoundToken';
