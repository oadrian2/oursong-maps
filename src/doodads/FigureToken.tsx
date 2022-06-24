import { Badge, Box } from '@mui/material';
import { ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import { TokenColor } from '../api/types';
import { baseDefaultState } from '../app/campaignState';
import { DeathMarker } from '../map/DeathMarker';
import { ContentLayer } from '../map/PlacedToken';
import { TokenFacing } from '../map/TokenFacing';
import { BorderLayer } from './BorderLayer';
import { Overlay } from './Overlay';
import { FigureBase } from './TokenBase';

export function BaseSizeBadge({ baseSize, defaultBaseSize, children }: BaseSizeBadgeProps) {
  return (
    <Badge
      color="secondary"
      badgeContent={baseSize === defaultBaseSize ? 0 : baseSize}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {children}
    </Badge>
  );
}

export type BaseSizeBadgeProps = {
  baseSize: number;
  defaultBaseSize: number;
  children: ReactNode;
};

export function SupplyFigureToken({ label, name, color, baseSize, defaultBaseSize }: SupplyFigureTokenProps) {
  return (
    <BaseSizeBadge baseSize={baseSize} defaultBaseSize={defaultBaseSize}>
      <Box sx={{ width: '48px', height: '48px' }}>
        <FigureBase title={name}>
          <BorderLayer color={color} />
          <ContentLayer>{label}</ContentLayer>
        </FigureBase>
      </Box>
    </BaseSizeBadge>
  );
}

export type SupplyFigureTokenProps = {
  label: string;
  name: string;
  color: TokenColor;
  baseSize: number;
  defaultBaseSize: number;
};

export function PlacedFigureToken({ label, name, color, baseSize, facing, overlay, active }: PlacedFigureTokenProps) {
  const baseDefault = useRecoilValue(baseDefaultState);

  return (
    <Box sx={{ width: '48px', height: '48px' }}>
      <Box sx={{ width: '100%', height: '100%', transform: `scale(${baseSize / baseDefault})` }}>
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
