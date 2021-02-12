import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { stashTokenRequested } from '../map/tokenSlice';
import { pathStopped } from '../ruler/rulerSlice';
import { Token } from '../map/Token';
import { selectStashedTokens } from '../map/tokenSlice';
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
    <div ref={drop} className="supply-stashed">
      <div className="stash">
        {tokens.map(({ id }) => (
          <Token key={id} id={id} dragType={ItemTypes.STASHED_TOKEN} />
        ))}
        {tokens.length === 0 && <div className="supply-stashed-empty">Stash</div>}
      </div>
    </div>
  );
}
