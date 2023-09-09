import { Box, Button, Checkbox, FormControlLabel, styled, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { nanoid } from 'nanoid';
import { Suspense, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { mapImageFileState, mapImageMetadataState, mapImageTitleState, optimizedMapBlobState } from './createMapState';
import { useDataURL } from './useDataURL';
import { campaignState } from '../app/campaignState';

export function CreateMap() {
  const setImage = useSetRecoilState(mapImageFileState);

  return (
    <Box sx={{ width: 'clamp(600px, 80%, 2000px)', marginInline: 'auto' }}>
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
  const campaign = useRecoilValue(campaignState(game!));

  const [id, setId] = useState<string | null>(null);

  const [points, setPoints] = useState([null, null] as [{ x: number; y: number } | null, { x: number; y: number } | null]);

  const [p1, p2] = points;

  useEffect(() => {
    setId(nanoid());
    setFigures([]);
  }, [setId, image]);

  const [figures, setFigures] = useState<{ id: string; name: string; shape: any }[]>([]);

  const handleAddFigure = () => {
    setFigures([
      ...figures,
      {
        id: nanoid(),
        name: '',
        shape: {
          type: 'figure',
          label: '',
          color: 'red',
          isGroup: false,
          baseSize: 30,
        },
      },
    ]);
  };

  const handleFigureChange = (newFigure: any) => {
    setFigures(figures.map((figure) => (figure.id === newFigure.id ? newFigure : figure)));
  };

  const handleSubmit = () => {
    if (!p1 || !p2) return;

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
      generators: figures,
    };

    console.log(id);
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
    <Box sx={{ display: 'flex', padding: 1 }}>
      <Box sx={{ padding: 1, width: 400, flex: 'none' }}>
        <Box>
          <TextField id="map-name" label="Name" value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
        </Box>
        {figures.map((figure) => (
          <FigureEditor baseOptions={campaign.metrics.baseOptions} key={figure.id} figure={figure} onFigureChange={handleFigureChange} />
        ))}
        <Box>
          <Button onClick={handleAddFigure}>Add Figure</Button>
        </Box>
        <Box>
          <Button onClick={handleSubmit}>Save</Button>
        </Box>
      </Box>
      <Box sx={{ flex: '1', display: 'grid' }}>
        {id}; {width} x {height}; {image.type}; {compactFormatter.format(image.size)}; {JSON.stringify(p1)}; {JSON.stringify(p2)}; {dist}
        <br />
        <ScrollingBox>
          <img src={imgSrc} alt="preview" onClick={handleClick} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        </ScrollingBox>
      </Box>
    </Box>
  );
}

function calcLabel(name: string) {
  return name.includes(' ')
    ? name
        .split(' ')
        .map((p) => p.charAt(0))
        .join('')
        .trim()
    : name.substring(0, 2);
}

export function FigureEditor({ baseOptions, figure, onFigureChange }: { baseOptions: number[], figure: any; onFigureChange: any }) {
  const {
    name,
    shape: { label, color, isGroup, baseSize },
  } = figure;

  const handleColorChange = (event: any, value: any) => {
    onFigureChange({ ...figure, shape: { ...figure.shape, color: value } });
  };

  const handleNameChange = (event: any) => {
    const newName = event.target.value;

    const newLabel = label === calcLabel(name) ? calcLabel(newName) : label;

    onFigureChange({ ...figure, name: event.target.value, shape: { ...figure.shape, label: newLabel } });
  };

  const handleLabelChange = (event: any) => {
    onFigureChange({ ...figure, shape: { ...figure.shape, label: event.target.value } });
  };

  const handleBaseChange = (event: any, value: any) => {
    onFigureChange({ ...figure, shape: { ...figure.shape, baseSize: value } });
  };

  const handleIsGroupChange = (event: any) => {
    onFigureChange({ ...figure, shape: { ...figure.shape, isGroup: event.target.checked } });
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap' }}>
        <TextField sx={{ width: '20ch' }} label="Name" value={name} onChange={handleNameChange} />
        <TextField sx={{ width: '8ch' }} label="Label" value={label} onChange={handleLabelChange} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap' }}>
        <ToggleButtonGroup color="primary" value={color} exclusive onChange={handleColorChange} aria-label="Color">
          <ToggleButton value="red">R</ToggleButton>
          <ToggleButton value="yellow">Y</ToggleButton>
          <ToggleButton value="blue">B</ToggleButton>
          <ToggleButton value="cyan">C</ToggleButton>
          <ToggleButton value="magenta">M</ToggleButton>
          <ToggleButton value="green">G</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup color="primary" value={baseSize} exclusive onChange={handleBaseChange} aria-label="Base Size">
          {baseOptions.map(size => <ToggleButton key={size} value={size}>{size}</ToggleButton>)}
        </ToggleButtonGroup>
      </Box>
      <FormControlLabel sx={{ marginTop: 2 }} control={<Checkbox checked={isGroup} onChange={handleIsGroupChange} />} label="Group" />
      <Box sx={{ marginTop: 2 }}>{JSON.stringify(figure, null, 2)}</Box>
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
  height: 80vh;

  overflow: scroll;

  scrollbar-width: thin;
`;
