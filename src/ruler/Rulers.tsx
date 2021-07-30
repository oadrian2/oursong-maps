import { useRecoilValue } from 'recoil';
import { selectedTokenIdState, userListState } from '../map/State';
import { Measurement } from './Measurement';
import './Rulers.css';

export const Rulers = ({ isMoving }: RulersProps) => {
  const selectedTokenId = useRecoilValue(selectedTokenIdState);
  const userList = useRecoilValue(userListState);

  return (
    <>
      {userList.map((id) => (
        <Measurement key={id} id={id} isMoving={isMoving} selectedTokenId={selectedTokenId} />
      ))}
    </>
  );
};

type RulersProps = { isMoving: boolean };
