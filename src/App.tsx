import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { nanoid } from 'nanoid';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import './App.css';
import { mapIdState } from './app/mapState';
import { CreateMap } from './create/CreateMap';
import { LoadingMessage } from './layout/LoadingMessage';
import { MapPage } from './map/MapPage';

function App() {
  return (
    <Suspense fallback={<div>Wakka Wakka</div>}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Router>
            <Routes>
              <Route path="/" element={<div>The GM will send you a link.</div>} />
              <Route path="maps/:game/:id" element={<LoadingMapPage />} />
              <Route path="create" element={<IDs />} />
              <Route path="create-map" element={<CreateMap />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </Suspense>
  );
}

const theme = createTheme({});

function IDs() {
  return <pre>{[...Array(20)].map(() => nanoid() + '\n')}</pre>;
}

function LoadingMapPage() {
  const { game, id } = useParams();

  const setMap = useSetRecoilState(mapIdState);

  useEffect(() => {
    game && id && setMap({ game, id });
  }, [setMap, game, id]);

  if (!game || !id) return <div>Invalid Map</div>;

  return (
    <React.Suspense fallback={<LoadingMessage>Loading...</LoadingMessage>}>
      <MapPage game={game} id={id} />
    </React.Suspense>
  );
}

export default App;
