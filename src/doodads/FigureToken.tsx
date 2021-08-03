import { forwardRef } from 'react';
import { TokenAllegiance } from '../app/tokenState';
import { Overlay } from './Overlay';
import { ColorKey, TokenBase } from './TokenBase';

export const FigureToken = forwardRef<HTMLDivElement, FigureTokenProps>(
  ({ isTemplate = false, index, prefix, label, allegiance, isGroup = false, overlay = null }, ref) => {
    const color = {
      [TokenAllegiance.Enemy]: 'red',
      [TokenAllegiance.Ally]: 'blue',
      [TokenAllegiance.Target]: 'yellow',
      [TokenAllegiance.Unknown]: 'green',
    }[allegiance] as ColorKey;

    if (isTemplate) {
      const effectiveLabel = `${prefix}${isGroup ? '#' : ''}`;
      const effectiveTitle = label;

      return (
        <TokenBase ref={ref} title={effectiveTitle} color={color}>
          {effectiveLabel}
        </TokenBase>
      );
    } else {
      // Group tokens present as Ab1, Ab2, Ab3, etc.
      // Leader (non-group) tokens present as Ab, Ab1, Ab2, etc where Ab1, Ab2 are subordinates.
      const effectiveLabel = `${prefix}${isGroup ? index + 1 : index || ''}`;
      const effectiveTitle = `${label} ${isGroup ? index + 1 : index || ''}`;

      return (
        <TokenBase ref={ref} title={effectiveTitle} color={color}>
          {effectiveLabel}
          {overlay && <Overlay>{overlay}</Overlay>}
        </TokenBase>
      );
    }
  }
);

export type FigureTokenProps = {
  index: number;
  prefix: string;
  label: string;
  allegiance: TokenAllegiance;
  overlay?: string | false | null;
  isTemplate?: boolean;
  isGroup?: boolean;
};
