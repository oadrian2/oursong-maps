import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from '@mui/icons-material/Remove';
import { ArcFab } from './ArcFab';

export function TokenSizeMenu({ closeMenu, enlargeToken, shrinkToken }: TokenSizeMenuProps) {
  const enlargeActionPosition = +0.0 * Math.PI;
  const shrinkActionPosition = -0.25 * Math.PI;

  const cancelActionPosition = +0.5 * Math.PI;

  return (
    <>
      <ArcFab angle={enlargeActionPosition} aria-label="enlarge" onClick={enlargeToken}>
        <AddIcon />
      </ArcFab>
      <ArcFab angle={shrinkActionPosition} aria-label="shrink" onClick={shrinkToken}>
        <RemoveIcon />
      </ArcFab>

      <ArcFab angle={cancelActionPosition} aria-label="close menu" onClick={closeMenu}>
        <ClearIcon />
      </ArcFab>
    </>
  );
}

type TokenSizeMenuProps = {
  enlargeToken: () => void;
  shrinkToken: () => void;
  closeMenu: () => void;
};
