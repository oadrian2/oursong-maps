import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TokenCapabilities } from '../app/tokenState';
import HeartPulseIcon from '../icons/HeartPulse';
import SkullIcon from '../icons/Skull';
import { ArcFab } from './ArcFab';

export function TokenMainMenu({
  isActive,
  isVisible,
  onSetActiveClicked,
  onSetVisibleClicked,
  onStashTokenClicked,
  onTrashTokenClicked,
  onOpenColorMenu,
  onOpenSizeMenu,
  onMoveClicked,
  capabilities,
}: TokenMainMenuProps) {
  const visibleActionPosition = +0.25 * Math.PI;
  const stashActionPosition = +0.75 * Math.PI;
  const trashActionPosition = -0.75 * Math.PI;
  const activeActionPosition = 0 * Math.PI;
  const colorActionPosition = -0.25 * Math.PI;

  const { canHide, canKill, canColor, canStash, canTrash } = capabilities;

  return (
    <>
      <ArcFab key="move" angle={0.5 * Math.PI} onClick={() => onMoveClicked()}>
        <DirectionsRunIcon />
      </ArcFab>
      {canHide && (
        <ArcFab key="visible" angle={visibleActionPosition} onClick={() => onSetVisibleClicked(!isVisible)}>
          {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </ArcFab>
      )}
      {canKill && (
        <ArcFab key="active" angle={activeActionPosition} onClick={() => onSetActiveClicked(!isActive)}>
          {isActive ? <HeartPulseIcon /> : <SkullIcon />}
        </ArcFab>
      )}
      {canColor && (
        <ArcFab key="color-menu" angle={colorActionPosition} onClick={onOpenColorMenu}>
          <PaletteIcon />
        </ArcFab>
      )}
      {canStash && (
        <ArcFab key="stash" angle={stashActionPosition} onClick={onStashTokenClicked}>
          <ArchiveIcon />
        </ArcFab>
      )}
      {canTrash && (
        <ArcFab key="trash" angle={trashActionPosition} onClick={onTrashTokenClicked}>
          <DeleteIcon />
        </ArcFab>
      )}
    </>
  );
}

type TokenMainMenuProps = {
  isActive: boolean;
  isVisible: boolean;
  onSetActiveClicked: (active: boolean) => void;
  onSetVisibleClicked: (visible: boolean) => void;
  onStashTokenClicked: () => void;
  onTrashTokenClicked: () => void;
  onOpenColorMenu: () => void;
  onOpenSizeMenu: () => void;
  onMoveClicked: () => void;
  capabilities: TokenCapabilities;
};
