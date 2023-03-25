import { AppBar, styled, Toolbar, Typography } from '@mui/material';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTitle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { api } from '../api/ws';
import { CustomDragLayer } from '../app/CustomDragLayer';
import { mapTitleState } from '../app/mapState';
import { Login } from '../layout/Login';
import { ConnectionInfo } from '../session/ConnectionInfo';
import SeatDialog from '../session/SeatDialog';
import { Supply } from '../supply/Supply';
import { MapLayer } from './MapLayer';

export function MapPage({ game, id }: { game: string; id: string }) {
  const title = useRecoilValue(mapTitleState);

  useTitle(`OurSong Maps - ${title}`);

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
    <>
      <MapLayout>
        <AppBar position="static" sx={{ gridArea: 'header' }}>
          <Toolbar sx={{ background: 'black' }}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Login />
          </Toolbar>
        </AppBar>
        <DndProvider backend={HTML5Backend}>
          <CustomDragLayer />
          <MapSidebar>
            <Supply />
          </MapSidebar>
          <MapContent>
            <MapLayer />
          </MapContent>
        </DndProvider>
      </MapLayout>
      <SeatDialog />
      <ConnectionInfo />
    </>
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
