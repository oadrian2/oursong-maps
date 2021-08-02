import ArchiveIcon from '@material-ui/icons/Archive';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { MouseEvent, useCallback } from 'react';
import { useToken } from '../doodads/useToken';
import { ArcFab } from './ArcFab';

export function TokenMenu({ id }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash }] = useToken(id);

  const movePosition = +0.5 * Math.PI;
  const visiblePosition = +0.25 * Math.PI;
  const stashPosition = +0.75 * Math.PI;
  const trashPosition = -0.75 * Math.PI;
  const activePosition = 0 * Math.PI;

  const onActiveClick = useCallback(() => setActive(!active), [active, setActive]);
  const onVisibleClick = useCallback(() => setVisible(!visible), [visible, setVisible]);

  const onMoveClick = useCallback((event: MouseEvent) => {
    console.log(event);
  }, []);

  return (
    <>
      <ArcFab angle={visiblePosition} onClick={onVisibleClick}>
        {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </ArcFab>
      <ArcFab angle={activePosition} onClick={onActiveClick}>
        {active ? <CheckIcon /> : <ClearIcon />}
      </ArcFab>
      <ArcFab angle={movePosition} onClick={onMoveClick}>
        <TrendingUpIcon />
      </ArcFab>
      <ArcFab angle={stashPosition} onClick={stash}>
        <ArchiveIcon />
      </ArcFab>
      <ArcFab angle={trashPosition} onClick={trash}>
        <DeleteIcon />
      </ArcFab>
    </>
  );
}

type TokenMenuProps = { id: string };
