import { Angle, Placement, Point } from '../api/types';

export const CELL_DIAMETER = 48.0;
export const CELL_RADIUS = CELL_DIAMETER / 2.0;

export const degToRad = (deg: number) => (Math.PI / 180) * deg;

export const radToDeg = (rad: number) => rad / (Math.PI / 180);

export const toCells = (distance: number) => distance / CELL_DIAMETER;
export const toPixels = (distance: number) => distance * CELL_DIAMETER;

/**
 * Calcultes if two points are the same.
 * @param {Point} positionA - The first position to compare.
 * @param {Point} positionB - The second position to compare.
 * @returns true if they are the same; otherwise false.
 */
export const arePointsSame = (positionA: Point, positionB: Point) => positionA.x === positionB.x && positionA.y === positionB.y;

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

/**
 * For each of two given placements determines if each is facing the other.
 * @param {Placement} origin - The first placement to compare.
 * @param {Placement} target - The second placement to compare.
 * @returns A tuple indicating if origin is facing the target and if the target is facing the origin. Placements without an
 * explicit facing are presumed to face in all directions.
 */
export function tokenConnection(origin: Placement, target: Placement): [boolean, boolean] {
  const { position: originPosition, facing: originFacing } = origin;
  const { position: targetPosition, facing: targetFacing } = target;

  const angleToTarget = Math.atan2(targetPosition.y - originPosition.y, targetPosition.x - originPosition.x);
  const angleToOrigin = Math.atan2(originPosition.y - targetPosition.y, originPosition.x - targetPosition.x);

  const isOriginFacingTarget = originFacing ? Math.cos(angleToTarget - originFacing) >= 0 : true;
  const isTargetFacingOrigin = targetFacing ? Math.cos(angleToOrigin - targetFacing) >= 0 : true;

  return [isOriginFacingTarget, isTargetFacingOrigin];
}

/**
 * Calculates a point on a circle drawn around a center point and reference point on the circle that is angle radians away
 * from the reference point.
 * @param {Point} center - The center of the circle that you are finding a relative point on.
 * @param {Point} reference - The reference point on the circumference of the circle that you are starting from.
 * @param {Angle} angle - The relative angle to move from the reference point to the new point
 * @returns A new point angle radians away from the reference point on a circle defined by an origin a reference point.
 */
export function offsetAngle(center: Point, reference: Point, angle: Angle): Point {
  return {
    x: center.x + (reference.x - center.x) * Math.cos(angle) + (center.y - reference.y) * Math.sin(angle),
    y: center.y + (reference.x - center.x) * Math.sin(angle) + (reference.y - center.y) * Math.cos(angle),
  };
}

/**
 * Rounds a number to a multiple.
 * @param value {number} - The number to round.
 * @param multiple {number} - The multiple to round the specified value to.
 * @returns The value rounded to the multiple.
 */
export function roundToMultiple(value: number, multiple: number) {
  const inv = 1.0 / multiple;

  return Math.round(value * inv) / inv;
}
