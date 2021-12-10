import styled from '@emotion/styled';
import { useTitle } from 'react-use';
import { useRecoilValue } from 'recoil';
import { mapTitleState } from '../app/mapState';

export function Header() {
  const title = useRecoilValue(mapTitleState);

  useTitle(`OurSong Maps - ${title}`);

  return <Title>{title}</Title>;
}

export const Title = styled.span`
  font-size: 2.5rem;
`;

Title.displayName = 'Title';
