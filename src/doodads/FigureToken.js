import { forwardRef } from 'react';
import { TokenAllegiance } from '../map/tokenSlice';
import { Overlay } from './Overlay';
import { TokenBase } from './TokenBase';

export const FigureToken = forwardRef(({ isTemplate, index, prefix, label, allegiance, isGroup, overlay }, ref) => {
  const color =
    {
      [TokenAllegiance.ALLY]: 'blue',
      [TokenAllegiance.ENEMY]: 'red',
      [TokenAllegiance.TARGET]: 'yellow',
    }[allegiance] || 'green';

  if (isTemplate) {
    const effectiveLabel = `${prefix}${isGroup ? '#' : ''}`;
    const effectiveTitle = label;

    return (
      <TokenBase title={effectiveTitle} color={color}>
        {effectiveLabel}
      </TokenBase>
    );
  } else {
    // Group tokens present as Ab1, Ab2, Ab3, etc.
    // Leader (non-group) tokens present as Ab, Ab1, Ab2, etc where Ab1, Ab2 are subordinates.
    const effectiveLabel = `${prefix}${isGroup ? index + 1 : index || ''}`;
    const effectiveTitle = `${label} ${isGroup ? index + 1 : index || ''}`;

    return (
      <TokenBase title={effectiveTitle} color={color}>
        {effectiveLabel}
        {overlay && <Overlay>{overlay}</Overlay>}
      </TokenBase>
    );
  }
});
