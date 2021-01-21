import { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import Token from '../doodads/Token';
import { selectStashedTokens, tokenStashRequested } from '../doodads/tokenSlice';
import { ItemTypes } from '../ItemTypes';
import './Supply.css';
import TokenGroup from './TokenGroup';
import { selectTokenGroupIds, standardPartyAdded } from './tokenGroupSlice';
import Trash from './Trash';

export default function Supply() {
  const dispatch = useDispatch();

  const tokenGroups = useSelector(selectTokenGroupIds);
  const tokens = useSelector(selectStashedTokens);

  useEffect(() => {
    dispatch(standardPartyAdded());
  }, [dispatch]);

  const [, drop] = useDrop({
    accept: ItemTypes.TOKEN,
    collect: () => ({}),
    drop: (item) => {
      const { id } = item;

      dispatch(tokenStashRequested(id));
    },
  });

  return (
    <div ref={drop} className="supply">
      <div className="supply-groups">
        {tokenGroups.map((id) => (
          <TokenGroup key={id} id={id} />
        ))}
      </div>
      <hr style={{ width: '100%' }} />
      <div className="supply-stashed">
        {tokens.map(({ id }) => (
          <Token key={id} id={id} />
        ))}
      </div>
      <hr style={{ width: '100%' }} />
      <div className="supply-fill" />
      <div className="supply-trash">
        <Trash />
      </div>
    </div>
  );
}
