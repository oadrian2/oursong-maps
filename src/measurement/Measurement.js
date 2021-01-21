import './Measurement.css';

function calculateCoordinates(start, end) {
  const { x, y } = start;
  const width = end.x - start.x;
  const height = end.y - start.y;
  const length = Math.hypot(height, width);
  const angle = Math.atan2(height, width);
  const unitLength = length / 60;

  return { x, y, length, unitLength, angle };
}

export function Measurement({ start, end, showRadius }) {
  const { x: left, y: top, length: width, unitLength, angle } = calculateCoordinates(start, end);

  return (
    <svg
      className="measure"
      style={{ left, top, width, transform: `translate(-50%, -50%) scale(2) rotate(${angle}rad)` }}
      viewBox="-1 -1 2 2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="3.5" refX="10" refY="1.75" orient="auto">
          <polygon points="0 0, 10 1.75, 0 3.5"></polygon>
        </marker>
      </defs>
      <line className="measure-arrow" x1="0" y1="0" x2="1" y2="0"></line>
      {showRadius && <circle className="measure-radius" cx="0" cy="0" r="1" />}
      <text className="measure-label" fontSize="0.15" x="0.4" y="0.15">
        {unitLength.toLocaleString(undefined, { maximumFractionDigits: 1 })} yd.
      </text>
    </svg>
  );
}
