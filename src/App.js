import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import './App.css';
import { selectConnected } from './connection/connectionSlice';
import MapLayer from './map/MapLayer';
import Supply from './supply/Supply';
import { Header } from './header/Header';

function App() {
  const connected = useSelector(selectConnected);

  console.log(connected);

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
}

export default App;
