import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Placement, TokenID } from '../api/types';
import { generatorState } from '../app/mapState';
import {
  centerToCenterCellDistance,
  centerToCenterNormalizedCellDistance,
  edgeToEdgeCellDistance,
  tokenConnection,
} from '../app/math';
import { MeasurementStrategy } from '../app/state';
import { fullTokenState, hoveredTokenIdState, selectedTokenIdState, tokenIndex } from '../app/tokenState';
import { FigureToken } from '../doodads/FigureToken';
import { MarkerToken } from '../doodads/MarkerToken';
import { DeathMarker } from './DeathMarker';
import { TokenFacing } from './TokenFacing';

export function PlacedToken({ id, onClick = () => {} }: PlacedTokenProps) {
  const [activeId, setActiveId] = useRecoilState(hoveredTokenIdState);

  const {
    position: selfPosition,
    facing: selfFacing,
    shape: selfShape,
    shape: { scale: selfScale },
    generator: selfGeneratorId,
    visible = true,
    active = true,
  } = useRecoilValue(fullTokenState(id))!;

  const {
    position: activePosition,
    facing: activeFacing,
    shape: { scale: activeScale },
  } = useRecoilValue(fullTokenState(activeId)) || { shape: {} };

  const selfGenerator = useRecoilValue(generatorState(selfGeneratorId))!;
  const index = useRecoilValue(tokenIndex(id));

  const selectedTokenId = useRecoilValue(selectedTokenIdState);
  const isSelected = selectedTokenId === id;

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
      {selfGenerator.shapeType === 'figure' && <TokenSelectionRing selected={isSelected} />}
      {selfGenerator.shapeType === 'marker' && <MarkerToken {...selfShape as any} effectRadius={2} />}
      {selfGenerator.shapeType === 'figure' && <FigureToken {...selfShape as any} index={index} overlay={overlay} />}
      {selfGenerator.shapeType === 'figure' && !active && <DeathMarker />}
      {selfGenerator.shapeType === 'figure' && typeof selfFacing === 'number' && <TokenFacing facing={selfFacing} />}
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

export function TokenSelectionRing({ selected }: { selected: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: -4,
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: selected ? 'lightgreen' : 'transparent',
        borderRadius: '50%',
        transition: 'border-color 0.2s ease-all',
      }}
    ></div>
  );
}
