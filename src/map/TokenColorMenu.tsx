import ClearIcon from '@mui/icons-material/Clear';
import { TokenColor } from '../api/types';
import LetterBIcon from '../icons/LetterB';
import LetterCIcon from '../icons/LetterC';
import LetterGIcon from '../icons/LetterG';
import LetterMIcon from '../icons/LetterM';
import LetterRIcon from '../icons/LetterR';
import LetterYIcon from '../icons/LetterY';
import { ArcFab } from './ArcFab';

export function TokenColorMenu({ setColor: onSetColor, closeMenu: onCloseMenu }: TokenColorMenuProps) {
  const setRedActionPosition = +0.25 * Math.PI;
  const setGreenActionPosition = +0.0 * Math.PI;
  const setBlueActionPosition = -0.25 * Math.PI;
  const setYellowActionPosition = +0.75 * Math.PI;
  const setCyanActionPosition = +1.0 * Math.PI;
  const setMagentaActionPosition = -0.75 * Math.PI;

  const cancelActionPosition = +0.5 * Math.PI;

  return (
    <>
      <ArcFab angle={setRedActionPosition} aria-label="color red" onClick={() => onSetColor(TokenColor.red)}>
        <LetterRIcon />
      </ArcFab>
      <ArcFab angle={setGreenActionPosition} aria-label="color green" onClick={() => onSetColor(TokenColor.green)}>
        <LetterGIcon />
      </ArcFab>
      <ArcFab angle={setBlueActionPosition} aria-label="color blue" onClick={() => onSetColor(TokenColor.blue)}>
        <LetterBIcon />
      </ArcFab>

      <ArcFab angle={setYellowActionPosition} aria-label="color yellow" onClick={() => onSetColor(TokenColor.yellow)}>
        <LetterYIcon />
      </ArcFab>
      <ArcFab angle={setCyanActionPosition} aria-label="color cyan" onClick={() => onSetColor(TokenColor.cyan)}>
        <LetterCIcon />
      </ArcFab>
      <ArcFab angle={setMagentaActionPosition} aria-label="color magenta" onClick={() => onSetColor(TokenColor.magenta)}>
        <LetterMIcon />
      </ArcFab>

      <ArcFab angle={cancelActionPosition} aria-label="close menu" onClick={onCloseMenu}>
        <ClearIcon />
      </ArcFab>
    </>
  );
}

type TokenColorMenuProps = {
  setColor: (color: TokenColor) => void;
  closeMenu: () => void;
};
