import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { TokenColor } from '../api/types';
import { specificCampaignState } from '../app/campaignState';
import { SupplyFigureToken } from '../doodads/FigureToken';

export function Details() {
  const { game } = useParams();

  const campaign = useRecoilValue(specificCampaignState(game!));

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h2">{campaign.title}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SpaceBarIcon />
            <Typography>{campaign.metrics.style === 'zone' ? 'zone' : campaign.metrics.cellSize}</Typography>
          </Box>
          <Box>
            <SupplyFigureToken label="AB" name="Example" baseSize={30} defaultBaseSize={0} color={TokenColor.blue} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40ch, 1fr))', gap: 2 }}>
        {campaign.maps?.map((m) => (
          <Card key={m.id} sx={{ elevation: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
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
                {m.generators.map((g: any) => (
                  <SupplyFigureToken
                    key={g.id}
                    label={g.shape.label}
                    name={g.name}
                    baseSize={g.shape.baseSize}
                    defaultBaseSize={campaign.metrics.baseDefault}
                    color={g.shape.color}
                  />
                ))}
              </Box>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to={`/maps/${m.game}/${m.id}`}>
                View
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
