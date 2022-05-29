import { Card, CardContent, FormControlLabel, FormGroup, Paper, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FullToken, Token } from '../api/types';
import { tagsDefaultState } from '../app/campaignState';
import { mapImageState } from '../app/mapState';

export function TokenFlyout({ show, fullToken, onClose }: TokenFlyoutProps) {
  const statuses = useRecoilValue(tagsDefaultState);

  const { width } = useRecoilValue(mapImageState);

  const [localNotes, setLocalNotes] = useState(fullToken.notes);
  const [localTags, setLocalTags] = useState(fullToken.tags);

  useEffect(() => {
    if (!show) {
      onClose({ notes: localNotes, tags: localTags });
    }
  }, [show, localNotes, localTags, onClose]);

  if (!show) return null;

  const handleStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const s = new Set(localTags);

    if (event.target.checked) {
      s.add(event.target.value);
    } else {
      s.delete(event.target.value);
    }

    setLocalTags([...s.values()]);
  };

  const pastMidway = fullToken.position!.x * 2 > width;

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'grid',
        position: 'absolute',
        top: '50%',
        left: pastMidway ? 'auto' : '16ch',
        right: pastMidway ? '16ch' : 'auto',
        background: 'white',
        minWidth: '50ch',
        minHeight: '8rem',
        transform: 'translateY(-50%)',
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            {fullToken.name}
          </Typography>
          <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(50%, 1fr))', gap: '10px 0' }}>
            {statuses.map((status) => (
              <FormControlLabel
                key={status}
                control={<Switch size="small" value={status} onChange={handleStatus} checked={localTags.includes(status)} />}
                label={<Typography variant="body2">{status}</Typography>}
              />
            ))}
            <TextField
              id="outlined-basic"
              label="Notes"
              variant="outlined"
              multiline
              rows={4}
              sx={{ gridColumn: '1/-1' }}
              value={localNotes}
              onChange={(event) => setLocalNotes(event.target.value)}
            />
          </FormGroup>
        </CardContent>
      </Card>
    </Paper>
  );
}

type TokenFlyoutProps = {
  show: boolean;
  fullToken: FullToken;
  onClose: (token: Partial<Token>) => void;
};
