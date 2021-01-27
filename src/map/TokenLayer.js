import { shallowEqual, useSelector } from 'react-redux';
import { Token } from './Token';
import { selectActiveTokens } from './tokenSlice';
import './MapLayer.css';
import { PlacedDoodad } from './PlacedDoodad';

export function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  return tokens.map(({ id, position }) => (
    <PlacedDoodad key={id} position={position}>
      <Token id={id} />
    </PlacedDoodad>
  ));
}
