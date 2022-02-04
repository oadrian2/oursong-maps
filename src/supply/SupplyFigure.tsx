import { Badge } from '@mui/material';
import { TokenColor } from '../api/types';
import { BorderLayer } from '../doodads/BorderLayer';
import { FigureBase } from '../doodads/TokenBase';
import { ContentLayer } from '../map/PlacedToken';
import { ScalingBox } from '../map/ScalingBox';

const baseDefault = 30;

export function SupplyFigure({ name, label, baseSize, color }: SupplyFigureProps) {
  return (
    <Badge
      color="secondary"
      badgeContent={baseSize === baseDefault ? 0 : baseSize}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <ScalingBox scale={1}>
        <FigureBase title={name}>
          <BorderLayer color={color} />
          <ContentLayer>{label}</ContentLayer>
        </FigureBase>
      </ScalingBox>
    </Badge>
  );
}

export type SupplyFigureProps = {
  name: string;
  label: string;
  baseSize: number;
  color: TokenColor;
};
