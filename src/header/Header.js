import { useSelector } from 'react-redux';
import { selectMap } from '../map/mapSlice';
import './Header.css';

export function Header() {
  const { title, ingameDate = 'TBD' } = useSelector(selectMap);

  return <span className="title">{title ? `${title} (${ingameDate})` : '...'}</span>;
}
