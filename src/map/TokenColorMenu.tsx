import ClearIcon from '@mui/icons-material/Clear';
import { TokenColor } from '../api/types';
import LetterBIcon from '../icons/LetterB';
import LetterCIcon from '../icons/LetterC';
import LetterGIcon from '../icons/LetterG';
import LetterMIcon from '../icons/LetterM';
import LetterRIcon from '../icons/LetterR';
import LetterYIcon from '../icons/LetterY';
import { ArcFab } from './ArcFab';

export function TokenColorMenu({ onSetColor, onCloseMenu }: TokenColorMenuProps) {
  const setRedActionPosition = +0.25 * Math.PI;
  const setGreenActionPosition = +0.0 * Math.PI;
  const setBlueActionPosition = -0.25 * Math.PI;
  const setYellowActionPosition = +0.75 * Math.PI;
  const setCyanActionPosition = +1.0 * Math.PI;
  const setMagentaActionPosition = -0.75 * Math.PI;

  const cancelActionPosition = +0.5 * Math.PI;

  return (
    <>
      <ArcFab angle={setRedActionPosition} onClick={() => onSetColor(TokenColor.red)}>
        <LetterRIcon />
      </ArcFab>
      <ArcFab angle={setGreenActionPosition} onClick={() => onSetColor(TokenColor.green)}>
        <LetterGIcon />
      </ArcFab>
      <ArcFab angle={setBlueActionPosition} onClick={() => onSetColor(TokenColor.blue)}>
        <LetterBIcon />
      </ArcFab>

      <ArcFab angle={setYellowActionPosition} onClick={() => onSetColor(TokenColor.yellow)}>
        <LetterYIcon />
      </ArcFab>
      <ArcFab angle={setCyanActionPosition} onClick={() => onSetColor(TokenColor.cyan)}>
        <LetterCIcon />
      </ArcFab>
      <ArcFab angle={setMagentaActionPosition} onClick={() => onSetColor(TokenColor.magenta)}>
        <LetterMIcon />
      </ArcFab>

      <ArcFab angle={cancelActionPosition} onClick={onCloseMenu}>
        <ClearIcon />
      </ArcFab>
    </>
  );
}

type TokenColorMenuProps = {
  onSetColor: (color: TokenColor) => void;
  onCloseMenu: () => void;
};
