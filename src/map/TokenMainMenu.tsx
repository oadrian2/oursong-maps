import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PaletteIcon from '@mui/icons-material/Palette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HeightIcon from '@mui/icons-material/Height';
import { TokenCapabilities } from '../app/tokenState';
import HeartPulseIcon from '../icons/HeartPulse';
import SkullIcon from '../icons/Skull';
import { ArcFab } from './ArcFab';

export function TokenMainMenu({
  isActive,
  isVisible,
  onMoveClicked,
  onSetActiveClicked,
  onSetVisibleClicked,
  onStashTokenClicked,
  onTrashTokenClicked,
  onOpenColorMenu,
  onOpenSizeMenu,
  onOpenAuraMenu,
  capabilities,
}: TokenMainMenuProps) {
  const activeActionPosition = 0 * Math.PI;
  const visibleActionPosition = +0.25 * Math.PI;
  const moveActionPosition = +0.5 * Math.PI;
  const stashActionPosition = +0.75 * Math.PI;
  const trashActionPosition = -0.75 * Math.PI;
  const sizeActionPosition = -0.5 * Math.PI;
  const colorActionPosition = -0.25 * Math.PI;

  const { canMove, canHide, canKill, canColor, canStash, canTrash, canSize, canChangeAura } = capabilities;

  return (
    <>
      {canKill && (
        <ArcFab key="active" angle={activeActionPosition} aria-label="toggle alive" onClick={() => onSetActiveClicked(!isActive)}>
          {isActive ? <HeartPulseIcon /> : <SkullIcon />}
        </ArcFab>
      )}
      {canHide && (
        <ArcFab key="visible" angle={visibleActionPosition} aria-label="toggle visibility" onClick={() => onSetVisibleClicked(!isVisible)}>
          {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </ArcFab>
      )}
      {canMove && (
        <ArcFab key="move" angle={moveActionPosition} aria-label="move" onClick={() => onMoveClicked()}>
          <DirectionsRunIcon />
        </ArcFab>
      )}
      {canStash && (
        <ArcFab key="stash" angle={stashActionPosition} aria-label="stash" onClick={onStashTokenClicked}>
          <ArchiveIcon />
        </ArcFab>
      )}
      {canTrash && (
        <ArcFab key="trash" angle={trashActionPosition} aria-label="trash" onClick={onTrashTokenClicked}>
          <DeleteIcon />
        </ArcFab>
      )}
      {canSize && (
        <ArcFab key="size-menu" angle={sizeActionPosition} aria-label="change size" onClick={onOpenSizeMenu}>
          <HeightIcon />
        </ArcFab>
      )}
      {canChangeAura && (
        <ArcFab key="size-menu" angle={sizeActionPosition} aria-label="change aura" onClick={onOpenAuraMenu}>
          <HeightIcon />
        </ArcFab>
      )}
      {canColor && (
        <ArcFab key="color-menu" angle={colorActionPosition} aria-label="change color" onClick={onOpenColorMenu}>
          <PaletteIcon />
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
  onOpenAuraMenu: () => void;
  capabilities: TokenCapabilities;
};
