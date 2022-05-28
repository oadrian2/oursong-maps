import { Card, CardContent, FormControlLabel, FormGroup, Paper, Switch, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Point } from '../api/types';
import { tagsDefaultState } from '../app/campaignState';
import { isControlledGeneratorState, mapImageState } from '../app/mapState';
import { isSelfMovingState } from '../app/rulerState';
import { activeTokenIDsState, selectedTokenIdState, tokenState } from '../app/tokenState';
import { useToken } from '../doodads/useToken';
import { PlacedToken } from './PlacedToken';
import { TokenMenu } from './TokenMenu';

export function TokenLayer() {
  const tokenIDs = useRecoilValue(activeTokenIDsState);

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {tokenIDs.map((id) => (
        <motion.div key={id} variants={variants} initial="hidden" animate="visible" exit="hidden">
          <AnimatedPlacedToken id={id} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function AnimatedPlacedToken({ id }: AnimatedPlacedTokenProps) {
  const [selectedTokenId, setSelectedTokenId] = useRecoilState(selectedTokenIdState);

  const { position, path: targetPath, generator } = useRecoilValue(tokenState(id))!;

  const isClaimed = useRecoilValue(isControlledGeneratorState(generator));
  const isSelected = selectedTokenId === id;

  const controls = useAnimation();

  const isMoving = useRecoilValue(isSelfMovingState);

  useEffect(() => {
    if (!position) return;

    const segments = targetPath?.length !== 0 ? targetPath : [position, position];

    const xCoords = segments.map(({ x }: Point) => x);
    const yCoords = segments.map(({ y }: Point) => y);

    controls.start({ left: xCoords, top: yCoords });

    // return () => controls.stop();
  }, [targetPath, position, controls]);

  const handleTokenClick = useCallback(() => {
    if (!isClaimed) return;

    setSelectedTokenId(id);
  }, [setSelectedTokenId, id, isClaimed]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 100 : undefined,
      }}
    >
      <PlacedToken id={id} onClick={handleTokenClick} isSelected={isSelected} />
      <TokenMenu id={id} showMenu={isSelected && !isMoving} />
      <TokenFlyout id={id} show={isSelected && !isMoving} />
    </motion.div>
  );
}

type AnimatedPlacedTokenProps = { id: string };

function TokenFlyout({ id, show }: TokenFlyoutProps) {
  const statuses = useRecoilValue(tagsDefaultState);

  const [{ name, notes, tags, position }, { setNotes, setTags }] = useToken(id)!;

  const { width } = useRecoilValue(mapImageState);

  const [localNotes, setLocalNotes] = useState(notes);
  const [localTags, setLocalTags] = useState(tags);

  useEffect(() => {
    if (localNotes === notes && localTags.every((t, i) => t === tags[i])) return;

    if (!show) {
      setNotes(localNotes);
      setTags(localTags);
    }
  }, [show, localNotes, notes, setNotes, localTags, tags, setTags]);

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

  const pastMidway = position!.x * 2 > width;

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
            {name}
          </Typography>
          <FormGroup sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(50%, 1fr))', gap: '10px 0' }}>
            {statuses.map((status) => (
              <FormControlLabel key={status} control={<Switch size="small" value={status} onChange={handleStatus} checked={localTags.includes(status)} />} label={<Typography variant="body2">{status}</Typography>} />
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

type TokenFlyoutProps = { id: string; show: boolean };

