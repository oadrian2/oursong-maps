import { MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react';

const scales = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0];
const initialScaleIndex = scales.indexOf(1.0);

export default function TestBed() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scaleIndex, setScaleIndex] = useState(initialScaleIndex);

  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(0);

  const width = 5555; // from image config
  const height = 5555; // from image config

  const scale = scales[scaleIndex];
  const handleMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();

    setPosition({ x: event.clientX - boundingBox.x, y: event.clientY - boundingBox.y });
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();

        console.log(event);

        const oldScale = scales[scaleIndex];
        const newScale = scales[Math.min(Math.max(scaleIndex - Math.sign(event.deltaY), 0), scales.length - 1)];

        const boundingBox = (event.target as Element)!.getBoundingClientRect();

        const oldX = (event.clientX - boundingBox.x) / oldScale;
        const oldY = (event.clientY - boundingBox.y) / oldScale;

        console.log(
          'oldX',
          oldX,
          'event.clientX',
          event.clientX,
          'newScale / oldScale',
          newScale / oldScale,
          'boundingBox.x',
          boundingBox.x,
          'horizontal',
          horizontal
        );

        const newX = (oldX * newScale) / oldScale - oldX;
        const newY = (oldY * newScale) / oldScale - oldY;

        console.log('newX', newX);

        setScaleIndex((index) => Math.min(Math.max(index - Math.sign(event.deltaY), 0), scales.length - 1));

        console.log(boundingBox);

        setHorizontal(newX);
        setVertical(newY);
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => document.removeEventListener('wheel', handleWheel);
  }, [scaleIndex, setScaleIndex, horizontal, setHorizontal, vertical, setVertical]);

  const handleScroll = (horizontal: number, vertical: number) => {
    setHorizontal(horizontal);
    setVertical(vertical);
  };

  return (
    <>
      <ScrollingContainer horizontal={horizontal} vertical={vertical} onScroll={handleScroll}>
        <div
          style={{
            width: 5555 * scale,
            height: 5555 * scale,
            backgroundImage: 'url(https://stoursongmaps.blob.core.windows.net/maps/ik/vpI3WkxKABckue4LawNTP/A38b%20The%20Temple.webp)',
            backgroundSize: 'cover',
          }}
          onMouseMove={handleMouseOver}
        ></div>
        {/* <img
          src="https://stoursongmaps.blob.core.windows.net/maps/ik/vpI3WkxKABckue4LawNTP/A38b%20The%20Temple.webp"
          width={2777.5}
          onMouseMove={handleMouseOver}
        /> */}
      </ScrollingContainer>
      <div style={{ position: 'fixed', color: 'black', backgroundColor: 'white', padding: 8, top: 16, left: 16 }}>
        {position.x / scale}, {position.y / scale}
        <br />
        {position.x}, {position.y}
      </div>
      <div style={{ position: 'fixed', color: 'black', backgroundColor: 'white', padding: 8, top: 16, right: 32 }}>
        {(scale * 100).toFixed(0) + '%'}
      </div>
    </>
  );
}

function ScrollingContainer({ vertical = 0, horizontal = 0, onScroll, children }: ScrollingContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current?.scrollTop !== vertical || ref.current?.scrollLeft !== horizontal) {
      ref.current?.scrollTo(horizontal, vertical);
      console.log('(horz, vert)', `(${horizontal}, ${vertical})`);
    }
  }, [vertical, horizontal]);

  const handleScroll = (event: any) => {
    console.log(event);
    onScroll && onScroll((event.target as Element).scrollLeft, (event.target as Element).scrollTop);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      style={{ height: '100vh', width: '100vw', border: '1px solid white', overflow: 'scroll', padding: 16 }}
    >
      {children}
    </div>
  );
}

type ScrollingContainerProps = {
  vertical?: number;
  horizontal?: number;
  onScroll?: (horizontal: number, vertical: number) => void;
  children: ReactNode;
};
