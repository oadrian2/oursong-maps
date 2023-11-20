import { Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';


export function DropImage({ onFileSelected }: { onFileSelected: (file: File) => void; }) {
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
