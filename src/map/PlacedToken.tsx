import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilState, useRecoilValue } from 'recoil';
import { generatorState } from '../app/mapState';
import {
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  edgeToEdgeCellDistance,
  Placement,
  tokenConnection
} from '../app/math';
import { MeasurementStrategy } from '../app/state';
import { RootState } from '../app/store';
import { fullTokenState, hoveredTokenIdState } from '../app/tokenState';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { TokenFacing } from './TokenFacing';
import { selectIndexWithinGroup, TokenID } from './tokenSlice';

export function PlacedToken({ id, onClick = () => {} }: PlacedTokenProps) {
  const [activeId, setActiveId] = useRecoilState(hoveredTokenIdState);

  const {
    position: selfPosition,
    facing: selfFacing,
    shape: { baseSize: selfBaseSize },
    generator: selfGeneratorId,
    visible = true,
  } = useRecoilValue(fullTokenState(id))!;

  const {
    position: activePosition,
    facing: activeFacing,
    shape: { baseSize: activeBaseSize },
  } = useRecoilValue(fullTokenState(activeId)) || { shape: {} };

  const selfGenerator = useRecoilValue(generatorState(selfGeneratorId))!;
  const index = useSelector((state: RootState) => selectIndexWithinGroup(state, { id, generator: selfGeneratorId }));

  const selfScale = (selfBaseSize ?? 30) / 30;
  const activeScale = (activeBaseSize ?? 30) / 30;

  const overlay =
    !!activeId &&
    activeId !== id &&
    !!activePosition &&
    !!selfPosition &&
    overlayText(
      { position: activePosition!, facing: activeFacing!, scale: activeScale! },
      { position: selfPosition!, facing: selfFacing!, scale: selfScale! },
      measurementStrategy[MeasurementStrategy.centerToCenterNormalized]
    );

  const handleMouseEnter = useCallback(() => setActiveId(id), [id, setActiveId]);
  const handleMouseLeave = useCallback(() => setActiveId(null), [setActiveId]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `scale(${selfScale})`, opacity: visible ? 1 : 0.5, transition: 'opacity 0.3s' }}
      onClick={onClick}
    >
      {selfGenerator.shapeType === 'marker' && <MarkerToken {...selfGenerator.shape} effectRadius={2} />}
      {selfGenerator.shapeType === 'figure' && <FigureToken {...selfGenerator.shape} index={index} overlay={overlay} />}
      {selfGenerator.shapeType === 'figure' && !!selfFacing && <TokenFacing facing={selfFacing} />}
    </div>
  );
}

type PlacedTokenProps = { id: TokenID; onClick?: React.EventHandler<React.SyntheticEvent> };

function overlayText(origin: Placement, target: Placement, strategy: (origin: Placement, target: Placement) => number) {
  const [isOriginFacingTarget, isTargetFacingOrigin] = tokenConnection(origin, target);

  const range = strategy(origin, target)!;

  return range.toFixed(1) + (!isOriginFacingTarget ? 'X' : isTargetFacingOrigin ? 'F' : 'B');
}

const measurementStrategy = {
  [MeasurementStrategy.centerToCenter]: centerToCenterCellDistance,
  [MeasurementStrategy.edgeToEdge]: edgeToEdgeCellDistance,
  [MeasurementStrategy.centerToCenterNormalized]: centerToCenterNormalizedCellDistance,
};
