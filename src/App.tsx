import styled from '@emotion/styled';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import './App.css';
import { CustomDragLayer } from './app/CustomDragLayer';
import { Header } from './header/Header';
import { MapLayer } from './map/MapLayer';
import { joinMapRequested, leaveMapRequested, selectConnected, selectLoaded } from './map/mapSlice';
import { mapId } from './map/State';
import { SessionDialog } from './session/SessionDialog';
import { Supply } from './supply/Supply';

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

function MapPage({ game, id }: { game: string; id: string }) {
  const dispatch = useDispatch();

  const connected = useSelector(selectConnected);
  const loaded = useSelector(selectLoaded);

  useEffect(() => {
    if (!connected) return;

    dispatch(joinMapRequested(game, id));

    return () => {
      dispatch(leaveMapRequested(game, id));
    };
  }, [connected, dispatch, game, id]);

  if (!loaded) return <LoadingMessage>Loading...</LoadingMessage>;

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <div className="grid-container">
        <div className="header">
          <Header />
        </div>
        <div className="sidebar">
          <Supply />
        </div>
        <div className="content">
          <MapLayer />
        </div>
      </div>
      <SessionDialog />
    </DndProvider>
  );
}

export default App;

export const LoadingMessage = styled.div`
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
  font-size: 1.4rem;
  font-weight: 500rem;
`;

LoadingMessage.displayName = 'LoadingMessage';
