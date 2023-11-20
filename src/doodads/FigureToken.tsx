import { Badge } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { TokenColor } from '../api/types';
import { baseDefaultState } from '../app/campaignState';
import { ContentLayer } from '../map/PlacedToken';
import { TokenFacing } from '../map/TokenFacing';
import { BorderLayer } from './BorderLayer';
import { DeathMarker } from './DeathMarker';
import { Overlay } from './Overlay';
import { ScaledBox } from './ScaledBox';
import { FigureBase } from './TokenBase';
import { UnscaledBox } from './UnscaledBox';

export function SupplyFigureToken({ label, name, color, baseSize, baseSizeInvisible = false }: SupplyFigureTokenProps) {
  return (
    <Badge
      color="secondary"
      badgeContent={baseSize}
      invisible={baseSizeInvisible}
      max={999}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <UnscaledBox>
        <FigureBase title={name}>
          <BorderLayer color={color} />
          <ContentLayer>{label}</ContentLayer>
        </FigureBase>
      </UnscaledBox>
    </Badge>
  );
}

export type SupplyFigureTokenProps = {
  label: string;
  name: string;
  color: TokenColor;
  baseSize: number;
  baseSizeInvisible?: boolean;
};

export function PlacedFigureToken({ label, name, color, baseSize, facing, overlay, active }: PlacedFigureTokenProps) {
  const baseDefault = useRecoilValue(baseDefaultState);

  return (
    <ScaledBox scale={baseSize / baseDefault}>
      <FigureBase title={name}>
        <BorderLayer color={color} />
        <ContentLayer>{label}</ContentLayer>
        {typeof facing === 'number' && <TokenFacing facing={facing} />}
        {!active && <DeathMarker />}
        {typeof overlay === 'string' && <Overlay>{overlay}</Overlay>}
      </FigureBase>
    </ScaledBox>
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
