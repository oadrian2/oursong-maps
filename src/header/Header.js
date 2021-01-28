import { useSelector } from 'react-redux';
import { selectMap } from '../map/mapSlice';
import './Header.css';

export function Header() {
  const { title, gameDate = 'TBD' } = useSelector(selectMap);

  return <span className="title">{title ? `${title} (${gameDate})` : '...'}</span>;
}
