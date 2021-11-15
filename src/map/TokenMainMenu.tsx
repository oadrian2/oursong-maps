import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';
import PaletteIcon from '@material-ui/icons/Palette';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import HeartPulseIcon from '../icons/HeartPulse';
import SkullIcon from '../icons/Skull';
import { ArcFab } from './ArcFab';

export function TokenMainMenu({
  isActive,
  isVisible,
  setActive,
  setVisible,
  stashToken,
  trashToken,
  openColorMenu,
  openSizeMenu,
}: TokenMainMenuProps) {
  const visibleActionPosition = +0.25 * Math.PI;
  const stashActionPosition = +0.75 * Math.PI;
  const trashActionPosition = -0.75 * Math.PI;
  const activeActionPosition = 0 * Math.PI;
  const colorActionPosition = -0.25 * Math.PI;

  return (
    <>
      <ArcFab key="visible" angle={visibleActionPosition} onClick={() => setVisible(!isVisible)}>
        {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </ArcFab>
      <ArcFab key="active" angle={activeActionPosition} onClick={() => setActive(!isActive)}>
        {isActive ? <HeartPulseIcon /> : <SkullIcon />}
      </ArcFab>
      <ArcFab key="color-menu" angle={colorActionPosition} onClick={openColorMenu}>
        <PaletteIcon />
      </ArcFab>
      <ArcFab key="stash" angle={stashActionPosition} onClick={stashToken}>
        <ArchiveIcon />
      </ArcFab>
      <ArcFab key="trash" angle={trashActionPosition} onClick={trashToken}>
        <DeleteIcon />
      </ArcFab>
    </>
  );
}

type TokenMainMenuProps = {
  isActive: boolean;
  isVisible: boolean;
  setActive: (active: boolean) => void;
  setVisible: (visible: boolean) => void;
  stashToken: () => void;
  trashToken: () => void;
  openColorMenu: () => void;
  openSizeMenu: () => void;
};
