/** @jsxImportSource @emotion/react */
import ArchiveIcon from '@material-ui/icons/Archive';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ArcFab } from './ArcFab';
import { stashTokenRequested, trashTokenRequested } from './tokenSlice';

export function TokenMenu({ id }) {
  const dispatch = useDispatch();

  const killPosition = +0.25 * Math.PI;
  const stashPosition = 0;
  const trashPosition = -0.25 * Math.PI;

  const onKillClick = useCallback(() => console.log('kill'), []);
  const onStashClick = useCallback(() => dispatch(stashTokenRequested({ id })), [dispatch, id]);
  const onTrashClick = useCallback(() => dispatch(trashTokenRequested({ id })), [dispatch, id]);

  return (
    <>
      <ArcFab angle={killPosition} onClick={onKillClick}>
        <ClearIcon />
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
