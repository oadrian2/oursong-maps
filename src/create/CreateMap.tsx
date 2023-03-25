import { Box, Button, styled, TextField } from '@mui/material';
import { nanoid } from 'nanoid';
import { Suspense, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { mapImageFileState, mapImageMetadataState, mapImageTitleState, optimizedMapBlobState } from './createMapState';
import { useDataURL } from './useDataURL';

export function CreateMap() {
  const setImage = useSetRecoilState(mapImageFileState);

  return (
    <Box sx={{ width: 'clamp(600px, 80%, 1200px)', marginInline: 'auto' }}>
      <DropImage onFileSelected={setImage} />
      <Suspense>
        <ShowImage />
      </Suspense>
    </Box>
  );
}

export function ShowImage() {
  const { game } = useParams();
  const { width, height } = useRecoilValue(mapImageMetadataState);
  const image = useRecoilValue(optimizedMapBlobState);
  const imgSrc = useDataURL(image);
  const [title, setTitle] = useRecoilState(mapImageTitleState);

  const [points, setPoints] = useState([null, null] as [{ x: number; y: number } | null, { x: number; y: number } | null]);

  const [p1, p2] = points;

  const handleSubmit = () => {
    if (!p1 || !p2) return;

    const id = nanoid();

    const scale = 50.0 / Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const imageFilename = title + getMappedExention(image.type);

    const data = {
      id,
      game,
      title: title,
      map: {
        image: imageFilename,
        scale,
        width,
        height,
      },
      generators: [],
    };

    console.log(data);

    const putMapData = () =>
      fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

    const putMapImage = () =>
      fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}/images/${imageFilename}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: image,
      });

    putMapData().then(putMapImage).then(console.log);
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const boundingRect = (event.target as Element).getBoundingClientRect();

    const x = event.clientX - boundingRect.x;
    const y = event.clientY - boundingRect.y;

    if (!p1 || p2) setPoints([{ x, y }, null]);
    else setPoints([p1, { x, y }]);
  };

  const dist = p1 && p2 && 50.0 / Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1 }}>
      <TextField id="map-name" label="Name" value={title} onChange={(event) => setTitle(event.currentTarget.value)} sx={{ width: '50%' }} />
      <Button onClick={handleSubmit}>Submit</Button>
      <Box sx={{}}>
        {width} x {height}; {image.type}; {compactFormatter.format(image.size)}; {JSON.stringify(p1)}; {JSON.stringify(p2)};{' '}
        {JSON.stringify(dist)}
        <br />
        <ScrollingBox>
          <img src={imgSrc} alt="preview" onClick={handleClick} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        </ScrollingBox>
      </Box>
    </Box>
  );
}

export function DropImage({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const onDrop = (acceptedFiles: File[]) => {
    onFileSelected(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } });

  return (
    <Box {...getRootProps()} sx={{ border: 1, margin: 'auto', padding: 1 }}>
      <input title="Drop Images Here" {...getInputProps()} />
      {isDragActive ? <p>Drop your map here ...</p> : <p>Drop your map here, or click to select it.</p>}
    </Box>
  );
}

const compactFormatter = new Intl.NumberFormat(undefined, { notation: 'compact' });

function getMappedExention(mimeType: string): string | undefined {
  return {
    'image/apng': '.apng',
    'image/avif': '.avif',
    'image/gif': '.gif',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  }[mimeType];
}

const ScrollingBox = styled('div')`
  width: 80vw;
  height: 80vh;

  overflow: scroll;

  scrollbar-width: thin;
`;
