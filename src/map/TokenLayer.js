import { shallowEqual, useSelector } from 'react-redux';
import { animated, useTransition } from 'react-spring';
import { ItemTypes } from '../ItemTypes';
import './MapLayer.css';
import { Token } from './Token';
import { selectActiveTokens } from './tokenSlice';

export function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  const transitions = useTransition(tokens, (token) => token.id, {
    from: { opacity: 0, transition: 'left .5s, top .5s', position: 'absolute' },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions.map(({ item: { id, position }, key, props }) => (
    <animated.div key={key} style={{ ...props, left: position.x, top: position.y }}>
      <Token id={id} dragType={ItemTypes.PLACED_TOKEN} />
    </animated.div>
  ));
}
