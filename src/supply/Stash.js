import { useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { Token } from '../map/Token';
import { selectStashedTokens } from '../map/tokenSlice';
import './Supply.css';

export function Stash() {
  const tokens = useSelector(selectStashedTokens);

  return tokens.map(({ id }) => <Token key={id} id={id} dragType={ItemTypes.STASHED_TOKEN} />);
}
