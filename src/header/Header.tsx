import styled from '@emotion/styled';
import { useTitle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { mapTitle } from '../map/State';

export function Header() {
  const title = useRecoilValue(mapTitle);

  useTitle(`OurSong Maps - ${title}`);

  return <Title>{title}</Title>;
}

export const Title = styled.span`
  font-size: 2.5rem;
  color: white;
`;

Title.displayName = 'Title';
