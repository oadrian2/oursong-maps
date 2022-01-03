import { forwardRef } from 'react';
import { TokenColor } from '../api/types';
import { Overlay } from './Overlay';
import { TokenBase } from './TokenBase';

export const FigureToken = forwardRef<HTMLDivElement, FigureTokenProps>(
  ({ isTemplate = false, index, prefix, name, color, isGroup = false, overlay = null }, ref) => {
    if (isTemplate) {
      const effectiveLabel = `${prefix}${isGroup ? '#' : ''}`;
      const effectiveTitle = name;

      return (
        <TokenBase ref={ref} title={effectiveTitle} color={color}>
          {effectiveLabel}
        </TokenBase>
      );
    } else {
      // Group tokens present as Ab1, Ab2, Ab3, etc.
      // Leader (non-group) tokens present as Ab, Ab1, Ab2, etc where Ab1, Ab2 are subordinates.
      const effectiveLabel = `${prefix}${isGroup ? index + 1 : index || ''}`;
      const effectiveTitle = `${name} ${isGroup ? index + 1 : index || ''}`;

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
  name: string;
  color: TokenColor;
  overlay?: string | false | null;
  isTemplate?: boolean;
  isGroup?: boolean;
};
