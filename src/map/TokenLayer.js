import { shallowEqual, useSelector } from 'react-redux';
import { Token } from './Token';
import { selectActiveTokens } from './tokenSlice';
import './MapLayer.css';

export function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  return tokens.map(({ id, position }) => (
    <PlacedToken key={id} position={position}>
      <Token id={id} />
    </PlacedToken>
  ));
}

export function PlacedToken({ position, children }) {
  return (
    <div className="doodad" style={{ left: position.x, top: position.y }}>
      {children}
    </div>
  );
}
