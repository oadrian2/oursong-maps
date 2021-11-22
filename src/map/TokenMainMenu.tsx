import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
