import PaletteIcon from '@mui/icons-material/Palette';
import { Scale } from '../api/types';
import { ArcFab } from './ArcFab';

export function TokenSizeMenu({ closeMenu: onCloseMenu, setSize: onSetSize }: TokenSizeMenuProps) {
  const setRedActionPosition = +0.25 * Math.PI;
  const setGreenActionPosition = +0.0 * Math.PI;
  const setBlueActionPosition = -0.25 * Math.PI;
  const setYellowActionPosition = +0.75 * Math.PI;

  const cancelActionPosition = +0.5 * Math.PI;

  return (
    <>
      <ArcFab angle={setRedActionPosition} onClick={() => onSetSize(30.0 / 30.0)}>
        <PaletteIcon />
      </ArcFab>
      <ArcFab angle={setGreenActionPosition} onClick={() => onSetSize(40.0 / 30.0)}>
        <PaletteIcon />
      </ArcFab>
      <ArcFab angle={setBlueActionPosition} onClick={() => onSetSize(50.0 / 30.0)}>
        <PaletteIcon />
      </ArcFab>
      <ArcFab angle={setYellowActionPosition} onClick={() => onSetSize(120.0 / 30.0)}>
        <PaletteIcon />
      </ArcFab>
      <ArcFab angle={cancelActionPosition} onClick={onCloseMenu}>
        <PaletteIcon />
      </ArcFab>
    </>
  );
}

type TokenSizeMenuProps = {
  setSize: (scale: Scale) => void;
  closeMenu: () => void;
};
