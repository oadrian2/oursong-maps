import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import { campaignsState } from '../app/campaignState';

export function CreateMap() {
  const { game } = useParams(); 

  const [campaign, setCampaign] = useState(game);
  const [images, setImages] = useState([] as any[]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, webp: '' });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);

    setImages(acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } });

  const handleCampaignChange = (event: SelectChangeEvent) => {
    setCampaign(event.target.value);
  };

  const handleImageLoad = (event: SyntheticEvent) => {
    const target = event.target as HTMLImageElement;

    const { width, height } = target;
    const webp = getWebP(target);

    console.log(webp);

    setImageDimensions({ width, height, webp });
  };

  const campaigns = useRecoilValue(campaignsState);

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
      <Box {...getRootProps()} sx={{ width: '80vw', border: 1, margin: 'auto', padding: 1 }}>
        <input title="Drop Images Here" {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </Box>
      {images.map((image) => (
        <Box key={image.name}>
          {imageDimensions.width} x {imageDimensions.height}; {image.type}; {image.name}
          <br />
          <img src={image.preview} style={{ maxWidth: '100%' }} alt="preview" onLoad={handleImageLoad} />
        </Box>
      ))}
    </Box>
  );
}

function getWebP(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(image, 0, 0);

  return canvas.toDataURL('image/webp', 1);
}
