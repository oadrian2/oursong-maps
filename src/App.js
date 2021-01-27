import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import './App.css';
import { CustomDragLayer } from './app/CustomDragLayer';
import { Header } from './header/Header';
import { MapLayer } from './map/MapLayer';
import { SessionDialog } from './session/SessionDialog';
import { Supply } from './supply/Supply';
import { selectClaimedGeneratorIds } from './supply/tokenGroupSlice';

function App() {
  const claimedGeneratorIds = useSelector(selectClaimedGeneratorIds);

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
