import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import './App.css';
import { LoadingMessage } from './layout/LoadingMessage';
import { MapPage } from './map/MapPage';
import { mapId } from './map/State';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/maps/:game/:id" component={LoadingMapPage} />
          <Route exact path="/create" component={IDs} />
          <Route path="/" component={() => <div>The GM will send you a link.</div>} />
        </Switch>
      </Router>
    </>
  );
}

function IDs() {
  return <pre>{[...Array(20)].map(() => nanoid() + '\n')}</pre>;
}

function LoadingMapPage({
  match: {
    params: { game, id },
  },
}: RouteComponentProps<{ game: string; id: string }>) {
  const setMap = useSetRecoilState(mapId);

  useEffect(() => {
    setMap({ game, id });
  }, [setMap, game, id]);

  return (
    <React.Suspense fallback={<LoadingMessage>Loading...</LoadingMessage>}>
      <MapPage game={game} id={id} />
    </React.Suspense>
  );
}

export default App;
