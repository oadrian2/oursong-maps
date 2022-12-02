import { Box, FormControl, Button, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { campaignsState } from '../app/campaignState';
import { nanoid } from 'nanoid';

export function CreateMapImage({ image, onLoad }: { image: Blob, onLoad: (imageData: { width: number, height: number, mimeType: string }) => void }) {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, url: '', mimeType: '' });
  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    const imageDataURL = URL.createObjectURL(image);

    setPreview(imageDataURL);

    return () => URL.revokeObjectURL(imageDataURL);
  }, [image]);

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;

    const { naturalWidth: width, naturalHeight: height } = target;
    const { url, mimeType } = getOptimized(target, width, height);

    console.log(mimeType, url.length);

    setImageDimensions({ width, height, url, mimeType });
    onLoad({ width, height, mimeType });
  };

  return (
    <Box>
      {imageDimensions.width} x {imageDimensions.height}; {image.type};
      <br />
      {imageDimensions.width} x {imageDimensions.height}; {imageDimensions.mimeType}; {imageDimensions.url.length}
      <br />
      <img src={preview} style={{ maxWidth: '100%' }} alt="preview" onLoad={handleImageLoad} />
      <br />
      <img src={imageDimensions.url} style={{ maxWidth: '100%' }} />
    </Box>
  );
}

export function CreateMap() {
  const { game } = useParams();

  const [campaign, setCampaign] = useState(game);
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [imageData, setImageData] = useState<{ width: number, height: number, mimeType: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);

    setImage(acceptedFiles[0]);
    setFormData({ ...formData, name: removeExtension(acceptedFiles[0].name) });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } });

  const handleCampaignChange = (event: SelectChangeEvent) => {
    setCampaign(event.target.value);
  };

  const campaigns = useRecoilValue(campaignsState);

  const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, name: event.target.value });
  };

  const handleLoad = (imageData: { width: number, height: number, mimeType: string }) => {
    setImageData(imageData);
  }

  const handleSubmit = (event: SyntheticEvent) => {
    if (!imageData) return;

    const id = nanoid();
    const { name } = image!;
    const { width, height } = imageData;

    const data = {
      id,
      game,
      title: formData.name,
      map: {
        image: name,
        scale: 1.0,
        width,
        height,
      },
      generators: [
      ],
    };

    console.log(data);

    // fetch(`${process.env.REACT_APP_HUB_URL}/map/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // }).then(console.log);
  };

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1 }}>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="campaign-label">Campaign</InputLabel>
        <Select labelId="campaign-label" id="campaign" value={campaign} label="Campaign" onChange={handleCampaignChange}>
          {campaigns.map(({ id, title }) => (
            <MenuItem key={id} value={id}>
              {title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField id="map-name" label="Name" value={formData.name} onChange={handleNameChange} sx={{ width: '50%' }} />
      <Box {...getRootProps()} sx={{ width: '80vw', border: 1, margin: 'auto', padding: 1 }}>
        <input title="Drop Images Here" {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </Box>
      { image && <Button onClick={handleSubmit}>Submit</Button> }
      { image && <CreateMapImage key={image.name} image={image} onLoad={handleLoad} /> }
    </Box>
  );
}

const compactFormatter = new Intl.NumberFormat(undefined, { notation: 'compact' });

function getOptimized(image: HTMLImageElement, width: number, height: number): { mimeType: string; url: string } {
  const mimeTypes = ['image/png', 'image/jpeg', 'image/webp'];

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  ctx?.drawImage(image, 0, 0);

  const [first, ...rest] = mimeTypes;

  const convert = (mimeType: string) => ({
    mimeType,
    url: canvas.toDataURL(mimeType),
  });

  return rest.reduce((minData, mimeType) => {
    const currData = convert(mimeType);

    console.info(
      `Comparing ${currData.mimeType} (${compactFormatter.format(currData.url.length)}) to ${minData.mimeType} (${compactFormatter.format(
        minData.url.length
      )})`
    );

    return currData.url.length < minData.url.length ? currData : minData;
  }, convert(first));
}

function removeExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

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
