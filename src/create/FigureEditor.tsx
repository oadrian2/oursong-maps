import { Box, Checkbox, FormControlLabel, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

export function FigureEditor({ baseOptions, figure, onFigureChange }: { baseOptions: number[]; figure: any; onFigureChange: any }) {
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
      </Box>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap' }}>
        <ToggleButtonGroup color="primary" value={baseSize} exclusive onChange={handleBaseChange} aria-label="Base Size">
          {baseOptions.map((size) => (
            <ToggleButton key={size} value={size}>
              {size}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <FormControlLabel sx={{ marginTop: 2 }} control={<Checkbox checked={isGroup} onChange={handleIsGroupChange} />} label="Group" />
      {/* <Box sx={{ marginTop: 2 }}>{JSON.stringify(figure, null, 2)}</Box> */}
    </Box>
  );
}

export function calcLabel(name: string) {
  return name.includes(' ')
    ? name
        .split(' ')
        .map((p) => p.charAt(0))
        .join('')
        .trim()
    : name.substring(0, 2);
}
