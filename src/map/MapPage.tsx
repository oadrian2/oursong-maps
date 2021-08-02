import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { api } from '../api/ws';
import { CustomDragLayer } from '../app/CustomDragLayer';
import { Header } from '../header/Header';
import { LoadingMessage } from '../layout/LoadingMessage';
import { ConnectionInfo } from '../session/ConnectionInfo';
import { SessionDialog } from '../session/SessionDialog';
import { Supply } from '../supply/Supply';
import { MapLayer } from './MapLayer';
import { selectConnected, selectLoaded } from './mapSlice';

export function MapPage({ game, id }: { game: string; id: string }) {
  const connected = useSelector(selectConnected);
  const loaded = useSelector(selectLoaded);

  const [loaded2, setLoaded2] = useState(false);

  useEffect(() => {
    if (!connected) return;

    api.connection.on('worldState', ({ tokens }) => {
      setLoaded2(true);
    });

    api.joinMap(game, id);
  }, [connected, game, id]);

  if (!loaded || !loaded2) return <LoadingMessage>Loading...</LoadingMessage>;

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
      <ConnectionInfo />
    </DndProvider>
  );
}
