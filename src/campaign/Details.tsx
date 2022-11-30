import DeleteIcon from '@mui/icons-material/Delete';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { Box, Button, Card, CardActions, CardContent, CardMedia, IconButton, Link, Typography } from '@mui/material';
import { useResolvedPath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Map, TokenColor } from '../api/types';
import { campaignState } from '../app/campaignState';
import { SupplyFigureToken } from '../doodads/FigureToken';
import { defaultGeneratorComparer } from '../stores/comparers';
import { routedGameKeyState } from '../stores/routedState';
import { meState } from '../stores/userStore';

export function Details() {
  const selectedGame = useRecoilValue(routedGameKeyState);
  const campaign = useRecoilValue(campaignState(selectedGame!));

  const me = useRecoilValue(meState);

  console.log(me);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 2, gap: 2 }}>
        <Typography variant="h2">{campaign.title}</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignSelf: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <SpaceBarIcon />
            <Typography>{campaign.metrics.style === 'zone' ? 'zone' : campaign.metrics.cellSize}</Typography>
          </Box>
          <SupplyFigureToken label="AB" name="Example" baseSize={30} color={TokenColor.blue} />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40ch, 1fr))', gap: 2 }}>
        {campaign.maps?.map((m) => (
          <MapCard key={m.id} map={m} />
        ))}
      </Box>
      <Link component={RouterLink} to="/campaign/sf">
        Starfinder
      </Link>
      <br />
      <Link component={RouterLink} to="/campaign/sw">
        Star Wars
      </Link>
      <br />
      <Link component={RouterLink} to="/campaign/ttb">
        Malifaux
      </Link>
      <br />
    </Box>
  );
}

export function MapCard({ map: m }: MapCardParams) {
  const game = useRecoilValue(routedGameKeyState);
  const urlToMap = useResolvedPath(`/maps/${game}/${m.id}`);

  const shareData = { url: urlToMap.pathname, title: m.title };

  const sortedGenerators = [...m.generators].sort(defaultGeneratorComparer);

  return (
    <Card sx={{ elevation: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={new URL(`/maps/${m.game}/${m.id}/${m.map.image}`, process.env.REACT_APP_STORAGE_URL).href}
        height="180"
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h5" gutterBottom>
          {m.title}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {sortedGenerators.map((g: any) => (
            <SupplyFigureToken
              key={g.id}
              name={g.name}
              label={g.shape.label + (g.shape.isGroup ? '#' : '')}
              baseSize={g.shape.baseSize}
              color={g.shape.color}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/maps/${m.game}/${m.id}`}>
          View
        </Button>
        {navigator.canShare(shareData) && <Button onClick={() => navigator.share(shareData)}>Share</Button>}
        <Box sx={{ ml: 'auto' }}>
          <IconButton color="secondary" disabled>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}

type MapCardParams = {
  map: Map;
};
