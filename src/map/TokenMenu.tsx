import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import PaletteIcon from '@material-ui/icons/Palette';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { MouseEvent, useCallback } from 'react';
import { TokenColor } from '../api/types';
import { useToken } from '../doodads/useToken';
import HeartPulseIcon from '../icons/HeartPulse';
import SkullIcon from '../icons/Skull';
import { ArcFab } from './ArcFab';

export function TokenMenu({ id }: TokenMenuProps) {
  const [
    {
      active = true,
      visible = true,
      shape: { color },
    },
    { setVisible, setActive, stash, trash, setColor },
  ] = useToken(id);

  const moveActionPosition = +0.5 * Math.PI;
  const visibleActionPosition = +0.25 * Math.PI;
  const stashActionPosition = +0.75 * Math.PI;
  const trashActionPosition = -0.75 * Math.PI;
  const activeActionPosition = 0 * Math.PI;
  const colorActionPosition = -0.25 * Math.PI;

  const onActiveClick = useCallback(() => setActive(!active), [active, setActive]);
  const onVisibleClick = useCallback(() => setVisible(!visible), [visible, setVisible]);

  const onColorClick = useCallback(() => setColor(nextColor(color)), [color, setColor]);

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
      <ArcFab angle={colorActionPosition} onClick={onColorClick}>
        <PaletteIcon />
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

function nextColor(color: TokenColor) {
  // rygcbv
  switch (color) {
    case TokenColor.red:
      return TokenColor.yellow;
    case TokenColor.yellow:
      return TokenColor.green;
    case TokenColor.green:
      return TokenColor.cyan;
    case TokenColor.cyan:
      return TokenColor.blue;
    case TokenColor.blue:
      return TokenColor.magenta;
      case TokenColor.magenta:
        return TokenColor.red;
    }
}
