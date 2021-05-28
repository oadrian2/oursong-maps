import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { selectMap } from '../map/mapSlice';

export function Header() {
  const { title, gameDate = 'TBD' } = useSelector(selectMap);

  return <Title>{title ? `${title} (${gameDate})` : '...'}</Title>;
}

export const Title = styled.span`
  font-size: 2.5rem;
  color: white;
`;

Title.displayName = 'Title';