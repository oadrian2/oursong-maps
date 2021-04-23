export const CELL_DIAMETER = 48.0;
export const CELL_RADIUS = CELL_DIAMETER / 2.0;

export const toCells = (distance) => distance / CELL_DIAMETER;
export const toPixels = (distance) => distance * CELL_DIAMETER;

export const pixelDistance = (positionA, positionB) => Math.hypot(positionB.x - positionA.x, positionB.y - positionA.y);

export function scaledDistance(distance, scale) {
  return { x: distance.x * scale, y: distance.y * scale };
}

export function centerToCenterCellDistance(originPosition, targetPosition) {
  return toCells(Math.hypot(originPosition.x - targetPosition.x, originPosition.y - targetPosition.y));
}

export function edgeToEdgeCellDistance(originPosition, targetPosition, originScale, targetScale) {
  const radiusAdjustment = (originScale + targetScale) / 2;

  return centerToCenterCellDistance(originPosition, targetPosition) - radiusAdjustment;
}

export function centerToCenterNormalizedCellDistance(originPosition, targetPosition, originScale, targetScale) {
  const radiusAdjustment = (originScale + targetScale) / 2 - 1; // center-to-center, but adjust all bases to 1" for calculation

  return centerToCenterCellDistance(originPosition, targetPosition) - radiusAdjustment;
}

export function tokenConnection(selfPosition, selfFacing, targetPosition, targetFacing) {
  const angleToTarget = Math.atan2(targetPosition.y - selfPosition.y, targetPosition.x - selfPosition.x);
  const angleToSelf = Math.atan2(selfPosition.y - targetPosition.y, selfPosition.x - targetPosition.x);

  const isSelfFacingTarget = Math.cos(angleToTarget - selfFacing) >= 0;
  const isTargetFacingSelf = Math.cos(angleToSelf - targetFacing) >= 0;

  return [isSelfFacingTarget, isTargetFacingSelf];
}
