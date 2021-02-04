import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { CustomDragLayer } from './app/CustomDragLayer';
import { Header } from './header/Header';
import { MapLayer } from './map/MapLayer';
import { SessionDialog } from './session/SessionDialog';
import { Supply } from './supply/Supply';
import { selectClaimedGeneratorIds } from './supply/generatorsSlice';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { selectConnected, joinMapRequested, leaveMapRequested, selectLoaded } from './map/mapSlice';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/maps/:game/:id" component={MapPage} />
        <Redirect to="/maps/ttb/0rZ9uL3ixv_cPgqEkRlnm" />
      </Switch>
    </Router>
  );
}

function MapPage({ match }) {
  const dispatch = useDispatch();

  const connected = useSelector(selectConnected);

  const loaded = useSelector(selectLoaded);

  const claimedGeneratorIds = useSelector(selectClaimedGeneratorIds);

  useEffect(() => {
    if (!connected) return;

    dispatch(joinMapRequested(match.params.game, match.params.id));

    return () => dispatch(leaveMapRequested(match.params.game, match.params.id));
  }, [connected, dispatch, match.params.game, match.params.id])


  if (!loaded) return "Loading...";

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
      {claimedGeneratorIds.length === 0 && <SessionDialog />}
    </DndProvider>
  );
}

export default App;
