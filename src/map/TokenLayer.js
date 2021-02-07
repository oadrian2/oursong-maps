import { shallowEqual, useSelector } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { ItemTypes } from '../ItemTypes';
import './MapLayer.css';
import { Token } from './Token';
import { selectActiveTokens } from './tokenSlice';

export function TokenLayer() {
  const tokens = useSelector(selectActiveTokens, shallowEqual);

  const transitions = useTransition(tokens, (token) => token.id, {
    from: { opacity: 0, transform: 'scale(0.5)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.5)' },
  });

  return transitions.map(({ item: { id, position }, key, props }) => (
    <PlacedToken key={key} position={position}>
      <animated.div style={props}>
        <Token id={id} dragType={ItemTypes.PLACED_TOKEN} />
      </animated.div>
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
