import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import React, { ReactNode } from 'react';

export const Seat = ({ name, children, onClaim = () => {} }: SeatProps) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={name} />
      <CardContent sx={{ flex: '1 0' }}>{children}</CardContent>
      <CardActions>
        <Button onClick={onClaim}>Claim</Button>
      </CardActions>
    </Card>
  );
};

export type SeatProps = { name: string; children: ReactNode; onClaim?: () => void };
