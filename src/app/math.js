export const degToRad = (deg) => (Math.PI / 180) * deg;

export const radToDeg = (rad) => rad / (Math.PI / 180);

export const offsetAngle = (origin, point, angle) => ({
  x: origin.x + (point.x - origin.x) * Math.cos(angle) + (origin.y - point.y) * Math.sin(angle),
  y: origin.y + (point.x - origin.x) * Math.sin(angle) + (point.y - origin.y) * Math.cos(angle),
});
