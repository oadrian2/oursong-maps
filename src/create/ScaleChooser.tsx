import { styled } from '@mui/material';
import { useEffect, useState } from 'react';

export function ScaleChooser({ imgSrc, onScaleChange }: ScaleChooserProps) {
  const [points, setPoints] = useState([null, null] as [{ x: number; y: number } | null, { x: number; y: number } | null]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const boundingRect = (event.target as Element).getBoundingClientRect();

    const x = event.clientX - boundingRect.x;
    const y = event.clientY - boundingRect.y;

    const [p1, p2] = points;

    if (!p1 || p2) setPoints([{ x, y }, null]);
    else setPoints([p1, { x, y }]);
  };

  useEffect(() => {
    const [p1, p2] = points;

    onScaleChange(p1 && p2 ? 50 / Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) : null);
  }, [points, onScaleChange]);

  return (
    <ScrollingBox>
      <img src={imgSrc} alt="preview" onClick={handleClick} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
    </ScrollingBox>
  );
}

export type ScaleChooserProps = {
  imgSrc: string;
  onScaleChange: (scale: number | null) => void;
};

export const ScrollingBox = styled('div')`
  height: 80vh;

  overflow: scroll;

  scrollbar-width: thin;
`;
