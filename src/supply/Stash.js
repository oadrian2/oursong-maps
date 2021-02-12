import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { selectStashedTokens, stashTokenRequested } from '../map/tokenSlice';
import { pathStopped } from '../ruler/rulerSlice';
import { StashedToken } from './StashedToken';
import './Supply.css';

export function Stash() {
  const dispatch = useDispatch();

  const tokens = useSelector(selectStashedTokens);

  const [, drop] = useDrop({
    accept: ItemTypes.PLACED_TOKEN,
    collect: () => ({}),
    drop: (item) => {
      const { id } = item;

      dispatch(stashTokenRequested({ id }));
      dispatch(pathStopped());
    },
  });

  return (
    <div ref={drop} className="token-container">
      {tokens.map(({ id }) => (
        <StashedToken key={id} id={id} />
      ))}
      {tokens.length === 0 && <div className="token-container-empty-label">Stash</div>}
    </div>
  );
}
