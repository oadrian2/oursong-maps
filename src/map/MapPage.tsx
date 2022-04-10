import { styled } from '@mui/material';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { api } from '../api/ws';
import { CustomDragLayer } from '../app/CustomDragLayer';
import { Header } from '../layout/Header';
import { ConnectionInfo } from '../session/ConnectionInfo';
import SeatDialog from '../session/SeatDialog';
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
      <MapLayout>
        <MapHeader>
          <Header />
        </MapHeader>
        <MapSidebar>
          <Supply />
        </MapSidebar>
        <MapContent>
          <MapLayer />
        </MapContent>
      </MapLayout>
      <SeatDialog />
      <ConnectionInfo />
    </DndProvider>
  );
}

export const MapLayout = styled('div')`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 4rem 1fr;
  grid-template-rows: 4rem 1fr;
  gap: 0;
  grid-template-areas:
    'header header'
    'sidebar content';
  background-color: black;
  color: white;
`;

export const MapHeader = styled('div')`
  grid-area: header;

  display: flex;
  align-items: center;

  padding-left: 1rem;
`;

export const MapSidebar = styled('div')`
  grid-area: sidebar;
`;

export const MapContent = styled('div')`
  grid-area: content;
  overflow: scroll;
  background-color: white;
  color: black;
  padding: 4rem;
`;
