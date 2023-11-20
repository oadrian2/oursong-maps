import SaveIcon from '@mui/icons-material/Save';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import { nanoid } from 'nanoid';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { FigureShape, Map, TokenColor } from '../api/types';
import { campaignState } from '../app/campaignState';
import { SupplyFigureToken } from '../doodads/FigureToken';
import { DropImage } from './DropImage';
import { FigureEditor } from './FigureEditor';
import { ScaleChooser } from './ScaleChooser';
import { mapImageFileState, mapImageMetadataState, mapImageTitleState, optimizedMapBlobState } from './createMapState';
import { useDataURL } from './useDataURL';

export function CreateMap() {
  const setImage = useSetRecoilState(mapImageFileState);

  return (
    <Box sx={{ width: 'clamp(600px, 80%, 2000px)', marginInline: 'auto' }}>
      <DropImage onFileSelected={setImage} />
      <Suspense>
        <MapEditor />
      </Suspense>
    </Box>
  );
}

type Figure = { id: string; name: string; shape: FigureShape };

export function MapEditor() {
  const { game } = useParams();
  const { width, height } = useRecoilValue(mapImageMetadataState);
  const image = useRecoilValue(optimizedMapBlobState);
  const imgSrc = useDataURL(image);
  const [title, setTitle] = useRecoilState(mapImageTitleState);
  const campaign = useRecoilValue(campaignState(game!));

  const [id, setId] = useState<string | null>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [figures, setFigures] = useState<Figure[]>([]);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);

  useEffect(() => {
    setId(nanoid());
    setFigures([]);
    setSelectedFigure(null);
  }, [setId, image]);

  const handleAddFigure = () => {
    const newFigure: Figure = {
      id: nanoid(),
      name: '',
      shape: {
        type: 'figure',
        label: '',
        color: TokenColor.red,
        isGroup: false,
        baseSize: 30,
      },
    };

    setFigures([...figures, newFigure]);
    setSelectedFigure(newFigure);
  };

  const handleFigureChange = (newFigure: Figure) => {
    setFigures(figures.map((figure) => (figure.id === newFigure.id ? newFigure : figure)));
    setSelectedFigure(newFigure);
  };

  const handleScaleChange = (newScale: number | null) => {
    setScale(newScale);
  };

  const handleSubmit = () => {
    if (!id || !game || !scale) return;

    const mapData: Map = {
      id,
      game,
      title,
      map: {
        image: title + getMappedExention(image.type),
        scale,
        width,
        height,
      },
      generators: figures,
    };

    saveMap(image, mapData);
  };

  return (
    <Box sx={{ display: 'flex', padding: 1 }}>
      <Box sx={{ padding: 1, width: 400, flex: 'none' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField id="map-name" label="Name" value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
          <IconButton onClick={handleSubmit} size="large">
            <SaveIcon />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'flex', flexFlow: 'wrap', gap: 2, marginTop: 4 }}>
          {figures.map((figure) => (
            <button key={figure.id} onClick={() => setSelectedFigure(figure)}>
              <SupplyFigureToken
                name={figure.name}
                label={(figure.shape.label || '??') + (figure.shape.isGroup ? '#' : '')}
                color={figure.shape.color}
                baseSize={figure.shape.baseSize}
              />
            </button>
          ))}
          <button onClick={handleAddFigure}>
            <SupplyFigureToken name="Add Token" label="+" color={TokenColor.red} baseSize={30} />
          </button>
        </Box>
        {selectedFigure && (
          <Box key={selectedFigure.id} sx={{ marginTop: 4 }}>
            <FigureEditor baseOptions={campaign.metrics.baseOptions} figure={selectedFigure} onFigureChange={handleFigureChange} />
          </Box>
        )}
      </Box>
      <Box sx={{ flex: '1', display: 'grid' }}>
        {id}; {width} x {height}; {image.type}; {compactFormatter.format(image.size)}; {scale}
        <br />
        <ScaleChooser imgSrc={imgSrc!} onScaleChange={handleScaleChange} />
      </Box>
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

async function saveMap(image: Blob, mapData: Map) {
  const { id, game } = mapData;

  const putMapData = () =>
    fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapData),
    });

  const putMapImage = () =>
    fetch(`${process.env.REACT_APP_HUB_URL}/maps/${game}/${id}/images/${mapData.map.image}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: image,
    });

  await putMapData();
  await putMapImage();
}
