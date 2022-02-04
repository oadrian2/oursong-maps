import { Angle, Placement, Point } from "../api/types";

export const CELL_DIAMETER = 48.0;
export const CELL_RADIUS = CELL_DIAMETER / 2.0;

export const degToRad = (deg: number) => (Math.PI / 180) * deg;

export const radToDeg = (rad: number) => rad / (Math.PI / 180);

export const toCells = (distance: number) => distance / CELL_DIAMETER;
export const toPixels = (distance: number) => distance * CELL_DIAMETER;

export const pixelDistance = (positionA: Point, positionB: Point) => Math.hypot(positionB.x - positionA.x, positionB.y - positionA.y);

export function centerToCenterCellDistance(origin: Placement, target: Placement) {
  const { position: originPosition } = origin;
  const { position: targetPosition } = target;

  return toCells(Math.hypot(originPosition.x - targetPosition.x, originPosition.y - targetPosition.y));
}

export function edgeToEdgeCellDistance(origin: Placement, target: Placement) {
  const { scale: originScale } = origin;
  const { scale: targetScale } = target;

  const radiusAdjustment = (originScale + targetScale) / 2;

  return centerToCenterCellDistance(origin, target) - radiusAdjustment;
}

export function centerToCenterNormalizedCellDistance(origin: Placement, target: Placement) {
  const { scale: originScale } = origin;
  const { scale: targetScale } = target;

  const radiusAdjustment = (originScale + targetScale) / 2 - 1; // center-to-center, but adjust all bases to 1" for calculation

  return centerToCenterCellDistance(origin, target) - radiusAdjustment;
}

export function tokenConnection(origin: Placement, target: Placement): [boolean, boolean] {
  const { position: originPosition, facing: originFacing } = origin;
  const { position: targetPosition, facing: targetFacing } = target;

  const angleToTarget = Math.atan2(targetPosition.y - originPosition.y, targetPosition.x - originPosition.x);
  const angleToOrigin = Math.atan2(originPosition.y - targetPosition.y, originPosition.x - targetPosition.x);

  const isOriginFacingTarget = originFacing ? Math.cos(angleToTarget - originFacing) >= 0 : true;
  const isTargetFacingOrigin = targetFacing ? Math.cos(angleToOrigin - targetFacing) >= 0 : true;

  return [isOriginFacingTarget, isTargetFacingOrigin];
}

export function offsetAngle(origin: Point, point: Point, angle: Angle): Point {
  return {
    x: origin.x + (point.x - origin.x) * Math.cos(angle) + (origin.y - point.y) * Math.sin(angle),
    y: origin.y + (point.x - origin.x) * Math.sin(angle) + (point.y - origin.y) * Math.cos(angle),
  };
}

export function roundToStep(value: number, step: number) {
  const inv = 1.0 / step;

  return Math.round(value * inv) / inv;
}