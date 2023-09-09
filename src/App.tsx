import { CssBaseline } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { nanoid } from 'nanoid';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import './App.css';
import { mapIdState } from './app/mapState';
import { Details as CampaignDetails } from './campaign/Details';
import { CreateMap } from './create/CreateMap';
import { LoadingMessage } from './layout/LoadingMessage';
import { MapPage } from './map/MapPage';
import { themeColorState } from './stores/preferences';
import { RecoilURLRouteSync } from './stores/RecoilURLRouteSync';
import TestBed from './TestBed/TestBed';

function App() {
  const themeColor = useRecoilValue(themeColorState);

  const theme = themeColor === 'dark' ? darkTheme : lightTheme;

  return (
    <Suspense fallback={<div>Wakka Wakka</div>}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<div>The GM will send you a link.</div>} />
              <Route path="maps/:game/create" element={<CreateMap />} />
              <Route
                path="maps/:game/:id"
                element={
                  <RecoilURLRouteSync>
                    <LoadingMapPage />
                  </RecoilURLRouteSync>
                }
              />
              <Route path="create" element={<IDs />} />
              <Route
                path="campaign/:game"
                element={
                  <RecoilURLRouteSync>
                    <CampaignDetails />
                  </RecoilURLRouteSync>
                }
              />
              <Route path="ws-test" element={<DoTheThing />} />
              <Route path="testbed" element={<TestBed />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </Suspense>
  );
}

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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

function DoTheThing() {
  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  const handleClick = () => {
    sendMessage('message from app');
  };

  return (
    <button type="button" onClick={handleClick}>
      Do the Thing
    </button>
  );
}

let webSocket: WebSocket | null = null;

function connect() {
  fetch('/api/login')
    .then((x) => x.text())
    .then((url) => {
      disconnect();

      webSocket = new WebSocket(url);

      webSocket.onopen = console.log;
      webSocket.onclose = console.log;
      webSocket.onmessage = console.log;
    });
}

function disconnect() {
  webSocket?.close();
}

function sendMessage(value: string) {
  webSocket?.send(value);
}

export default App;
