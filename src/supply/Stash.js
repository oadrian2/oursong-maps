import { useSelector } from 'react-redux';
import Token from '../doodads/Token';
import { selectStashedTokens } from '../doodads/tokenSlice';
import './Supply.css';

export default function Stash() {
  const tokens = useSelector(selectStashedTokens);

  return tokens.map(({ id }) => <Token key={id} id={id} />);
}
