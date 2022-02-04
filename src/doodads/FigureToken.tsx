import { Box } from '@mui/material';
import { TokenColor } from '../api/types';
import { DeathMarker } from '../map/DeathMarker';
import { ContentLayer } from '../map/PlacedToken';
import { TokenFacing } from '../map/TokenFacing';
import { BorderLayer } from './BorderLayer';
import { Overlay } from './Overlay';
import { FigureBase } from './TokenBase';

export function FigureToken({ label, name, color, isGroup }: FigureTokenProps) {
  const effectiveLabel = `${label}${isGroup ? '#' : ''}`;
  const effectiveTitle = name;

  return (
    <Box sx={{ width: '48px', height: '48px' }}>
      <FigureBase title={effectiveTitle}>
        <BorderLayer color={color} />
        <ContentLayer>{effectiveLabel}</ContentLayer>
      </FigureBase>
    </Box>
  );
}

export type FigureTokenProps = {
  label: string;
  name: string;
  color: TokenColor;
  isGroup: boolean;
};

export function PlacedFigureToken({ label, name, color, baseSize, facing, overlay, active }: PlacedFigureTokenProps) {
  return (
    <Box sx={{ width: '48px', height: '48px' }}>
      <Box sx={{ width: '100%', height: '100%', transform: `scale(${baseSize / 30.0})` }}>
        <FigureBase title={name}>
          <BorderLayer color={color} />
          <ContentLayer>{label}</ContentLayer>
          {typeof facing === 'number' && <TokenFacing facing={facing} />}
          {!active && <DeathMarker />}
          {typeof overlay === 'string' && <Overlay>{overlay}</Overlay>}
        </FigureBase>
      </Box>
    </Box>
  );
}

export type PlacedFigureTokenProps = {
  label: string;
  name: string;
  color: TokenColor;
  baseSize: number;
  facing?: number;
  active: boolean;
  overlay?: string;
};
