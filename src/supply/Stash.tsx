import { useSelector } from 'react-redux';
import { selectStashedTokens } from '../map/tokenSlice';
import { StashedToken } from './StashedToken';
import './Supply.css';

export function Stash() {
  const tokens = useSelector(selectStashedTokens);

  return (
    <div className="token-container">
      {tokens.map(({ id }) => (
        <StashedToken key={id} id={id} />
      ))}
      {tokens.length === 0 && <div className="token-container-empty-label">Stash</div>}
    </div>
  );
}
