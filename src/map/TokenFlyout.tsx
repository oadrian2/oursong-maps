import { Card, CardContent, FormControlLabel, FormGroup, Paper, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TokenID } from '../api/types';
import { tagsDefaultState } from '../app/campaignState';
import { mapImageState } from '../app/mapState';
import { useToken } from '../doodads/useToken';

export function TokenFlyout({ id, show }: TokenFlyoutProps) {
  const showRef = useRef(show);

  const statuses = useRecoilValue(tagsDefaultState);

  const { width } = useRecoilValue(mapImageState);

  const [token, { patchToken }] = useToken(id);

  const [localNotes, setLocalNotes] = useState(token.notes);
  const [localTags, setLocalTags] = useState(token.tags);

  useEffect(() => {
    if (showRef.current === true && !show) {
      showRef.current = false;

      patchToken({ notes: localNotes, tags: localTags });
    }

    if (showRef.current === false && show) {
      showRef.current = true;

      setLocalNotes(token.notes);
      setLocalTags(token.tags);
    }
  }, [show, localNotes, localTags, token, patchToken]);

  // If not shown or stashed, then hide.
  if (!show || !token.position) return null;

  const handleStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const s = new Set(localTags);

    if (event.target.checked) {
      s.add(event.target.value);
    } else {
      s.delete(event.target.value);
    }

    setLocalTags([...s.values()]);
  };

  const pastMidway = token.position.x * 2 > width;

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
            {token.name}
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
  id: TokenID;
  show: boolean;
};
