/** @jsxImportSource @emotion/react */
export default function MapGrid() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="2%" height="2%" patternUnits="objectBoundingBox">
          <path d="M .02 0 L 0 0 0 .02" fill="none" stroke="gray" stroke-width="0.5" />
        </pattern>
        <pattern id="grid" width="20%" height="20%" patternUnits="objectBoundingBox">
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
          <path d="M .2 0 L 0 0 0 .2" fill="none" stroke="gray" stroke-width="1" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
