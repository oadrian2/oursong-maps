import ArchiveIcon from '@material-ui/icons/Archive';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRecoilState } from 'recoil';
import { RootState } from '../app/store';
import { pathStarted, requestUpdateRemoteRuler } from '../ruler/rulerSlice';
import { ArcFab } from './ArcFab';
import { tokenActive } from './State';
import { selectTokenById, stashTokenRequested, toggleTokenVisibilityRequested, trashTokenRequested } from './tokenSlice';

export function TokenMenu({ id }: TokenMenuProps) {
  const dispatch = useDispatch();

  const movePosition = +0.5 * Math.PI;
  const visiblePosition = +0.25 * Math.PI;
  const stashPosition = +0.75 * Math.PI;
  const trashPosition = -0.75 * Math.PI;
  const activePosition = 0 * Math.PI;

  const { position, visible = true } = useSelector((state: RootState) => selectTokenById(state, id))!;

  // const [visible, setVisible] = useRecoilState(tokenVisible(id));
  const [active, setActive] = useRecoilState(tokenActive(id));

  const onMoveClick = useCallback(() => {
    dispatch(pathStarted(position));
    dispatch(requestUpdateRemoteRuler());
  }, [dispatch, position]);
  const onActiveClick = useCallback(() => setActive(!active), [active, setActive]);
  const onVisibleClick = useCallback(() => dispatch(toggleTokenVisibilityRequested({ id, visible: !visible })), [dispatch, visible, id]);
  const onStashClick = useCallback(() => dispatch(stashTokenRequested({ id })), [dispatch, id]);
  const onTrashClick = useCallback(() => dispatch(trashTokenRequested({ id })), [dispatch, id]);

  return (
    <>
      <ArcFab angle={visiblePosition} onClick={onVisibleClick}>
        {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </ArcFab>
      <ArcFab angle={activePosition} onClick={onActiveClick}>
        {active ? <CheckIcon /> : <ClearIcon />}
      </ArcFab>
      <ArcFab angle={movePosition} onClick={onMoveClick}>
        <TrendingUpIcon />
      </ArcFab>
      <ArcFab angle={stashPosition} onClick={onStashClick}>
        <ArchiveIcon />
      </ArcFab>
      <ArcFab angle={trashPosition} onClick={onTrashClick}>
        <DeleteIcon />
      </ArcFab>
    </>
  );
}

type TokenMenuProps = { id: string };
