import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { MouseEvent, useCallback } from 'react';
import { useToken } from '../doodads/useToken';
import HeartPulseIcon from '../icons/HeartPulse';
import SkullIcon from '../icons/Skull';
import { ArcFab } from './ArcFab';

export function TokenMenu({ id }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash }] = useToken(id);

  const moveActionPosition = +0.5 * Math.PI;
  const visibleActionPosition = +0.25 * Math.PI;
  const stashActionPosition = +0.75 * Math.PI;
  const trashActionPosition = -0.75 * Math.PI;
  const activeActionPosition = 0 * Math.PI;

  const onActiveClick = useCallback(() => setActive(!active), [active, setActive]);
  const onVisibleClick = useCallback(() => setVisible(!visible), [visible, setVisible]);

  const onMoveClick = useCallback((event: MouseEvent) => {
    console.log(event);
  }, []);

  return (
    <>
      <ArcFab angle={visibleActionPosition} onClick={onVisibleClick}>
        {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </ArcFab>
      <ArcFab angle={activeActionPosition} onClick={onActiveClick}>
        {active ? <HeartPulseIcon /> : <SkullIcon />}
      </ArcFab>
      <ArcFab angle={moveActionPosition} onClick={onMoveClick}>
        <TrendingUpIcon />
      </ArcFab>
      <ArcFab angle={stashActionPosition} onClick={stash}>
        <ArchiveIcon />
      </ArcFab>
      <ArcFab angle={trashActionPosition} onClick={trash}>
        <DeleteIcon />
      </ArcFab>
    </>
  );
}

type TokenMenuProps = { id: string };
