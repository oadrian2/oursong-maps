export type Point = { x: number; y: number };
export type Facing = number;
export type Scale = number;

export const CELL_DIAMETER = 48.0;
export const CELL_RADIUS = CELL_DIAMETER / 2.0;

export const degToRad = (deg: number) => (Math.PI / 180) * deg;

export const radToDeg = (rad: number) => rad / (Math.PI / 180);

export const toCells = (distance: number) => distance / CELL_DIAMETER;
export const toPixels = (distance: number) => distance * CELL_DIAMETER;

export const pixelDistance = (positionA: Point, positionB: Point) => Math.hypot(positionB.x - positionA.x, positionB.y - positionA.y);

export function centerToCenterCellDistance(originPosition: Point, targetPosition: Point) {
  return toCells(Math.hypot(originPosition.x - targetPosition.x, originPosition.y - targetPosition.y));
}

export function edgeToEdgeCellDistance(originPosition: Point, targetPosition: Point, originScale: Scale, targetScale: Scale) {
  const radiusAdjustment = (originScale + targetScale) / 2;

  return centerToCenterCellDistance(originPosition, targetPosition) - radiusAdjustment;
}

export function centerToCenterNormalizedCellDistance(originPosition: Point, targetPosition: Point, originScale: Scale, targetScale: Scale) {
  const radiusAdjustment = (originScale + targetScale) / 2 - 1; // center-to-center, but adjust all bases to 1" for calculation

  return centerToCenterCellDistance(originPosition, targetPosition) - radiusAdjustment;
}

export function tokenConnection(selfPosition: Point, selfFacing: Facing, targetPosition: Point, targetFacing: Facing): [boolean, boolean] {
  const angleToTarget = Math.atan2(targetPosition.y - selfPosition.y, targetPosition.x - selfPosition.x);
  const angleToSelf = Math.atan2(selfPosition.y - targetPosition.y, selfPosition.x - targetPosition.x);

  const isSelfFacingTarget = Math.cos(angleToTarget - selfFacing) >= 0;
  const isTargetFacingSelf = Math.cos(angleToSelf - targetFacing) >= 0;

  return [isSelfFacingTarget, isTargetFacingSelf];
}

export function offsetAngle(origin: Point, point: Point, angle: number): Point {
  return {
    x: origin.x + (point.x - origin.x) * Math.cos(angle) + (origin.y - point.y) * Math.sin(angle),
    y: origin.y + (point.x - origin.x) * Math.sin(angle) + (point.y - origin.y) * Math.cos(angle),
  };
}
