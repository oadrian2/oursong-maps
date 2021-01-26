import { shallowEqual, useSelector } from 'react-redux';
import Token from '../doodads/Token';
import { selectActiveTokens } from '../doodads/tokenSlice';
import './MapLayer.css';
import { PlacedDoodad } from './PlacedDoodad';

export default function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  console.log(tokens);

  return tokens.map(({ id, position }) => (
    <PlacedDoodad key={id} position={position}>
      <Token id={id} />
    </PlacedDoodad>
  ));
}
