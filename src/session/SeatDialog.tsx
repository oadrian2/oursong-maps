import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { GeneratorID, isMarkerShape } from '../api/types';
import { baseDefaultState, groupsState } from '../app/campaignState';
import { claimedFigureGeneratorListState, figureGeneratorListState, generatorState } from '../app/mapState';
import { isGMState } from '../app/userState';
import { SupplyFigureToken } from '../doodads/FigureToken';
import { Seat } from './Seat';

const SeatDialog = () => {
  const groups = useRecoilValue(groupsState);
  const claimed = useRecoilValue(claimedFigureGeneratorListState);

  return (
    <Dialog open={!claimed.length} aria-labelledby="seat-dialog-title" maxWidth="lg" fullWidth>
      <DialogTitle id="seat-dialog-title">Take a Seat</DialogTitle>
      <DialogContent>
        <SeatList>
          <GMSeat />
          {groups.map((seat, index) => (
            <PlayerSeat key={index} name={seat.name} generators={seat.generators} />
          ))}
        </SeatList>
      </DialogContent>
    </Dialog>
  );
};

export default SeatDialog;

const SeatList = styled('div')`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
  grid-auto-rows: 1fr;
`;

const GMSeat = () => {
  const setIsGM = useSetRecoilState(isGMState);
  const setClaimed = useSetRecoilState(claimedFigureGeneratorListState);
  const figureGenerators = useRecoilValue(figureGeneratorListState);

  const handleClaim = () => {
    setIsGM(true);
    setClaimed(figureGenerators);
  };

  return (
    <Seat name="GM" onClaim={handleClaim}>
      <Box sx={{ marginInline: 'auto', width: '40%' }}>
        <Box component="img" src="/gm.png" alt="D20" sx={{ width: '100%' }} />
      </Box>
    </Seat>
  );
};

const PlayerSeat = ({ name, generators }: PlayerSeatProps) => {
  const setClaimed = useSetRecoilState(claimedFigureGeneratorListState);

  const handleClaim = () => {
    setClaimed(generators);
  };

  return (
    <Seat name={name} onClaim={handleClaim}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {generators.map((id) => (
          <FigureLine key={id} id={id} />
        ))}
      </Box>
    </Seat>
  );
};

type PlayerSeatProps = { name: string; generators: string[] };

const FigureLine = ({ id }: FigureLineProps) => {
  const generator = useRecoilValue(generatorState(id));
  const baseDefault = useRecoilValue(baseDefaultState);

  if (!generator || isMarkerShape(generator.shape)) throw new Error('Augh!');

  const {
    name,
    shape: { label, color, baseSize = baseDefault },
  } = generator;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <SupplyFigureToken label={label} name={name} color={color} baseSize={baseSize} />
      <Typography variant="body1">{name}</Typography>
    </Box>
  );
};

type FigureLineProps = { id: GeneratorID };
