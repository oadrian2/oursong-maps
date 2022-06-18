import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { campaignsState } from '../app/campaignState';
import { useDropzone } from 'react-dropzone';

export function CreateMap() {
  const [campaign, setCampaign] = useState('');
  const [images, setImages] = useState([] as any[]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);

    setImages(acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [] } });

  const handleCampaignChange = (event: SelectChangeEvent) => {
    setCampaign(event.target.value);
  };

  const handleImageLoad = (event: SyntheticEvent) => {
    const { width, height } = event.target as HTMLImageElement;

    setImageDimensions({ width, height });
  }

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
      <Box>
        {images.map((image) => (
          <Box key={image.name}>
            {imageDimensions.width} x {imageDimensions.height}; {image.type}; {image.name}<br />
            <img src={image.preview} alt="preview" onLoad={handleImageLoad} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
