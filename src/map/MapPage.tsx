import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { api } from '../api/ws';
import { CustomDragLayer } from '../app/CustomDragLayer';
import { Header } from '../header/Header';
import { ConnectionInfo } from '../session/ConnectionInfo';
import { SessionDialog } from '../session/SessionDialog';
import { Supply } from '../supply/Supply';
import { MapLayer } from './MapLayer';

export function MapPage({ game, id }: { game: string; id: string }) {
  useEffect(() => {
    const connect = async () => {
      await api.connect();

      api.joinMap(game, id);
    };

    const disconnect = () => {
      api.connection.stop();
    };

    connect();

    return () => disconnect();
  }, [game, id]);

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
