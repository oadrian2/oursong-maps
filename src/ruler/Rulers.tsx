import { useRecoilValue } from 'recoil';
import { userListState } from '../app/userState';
import { Measurement } from './Measurement';
import './Rulers.css';

export const Rulers = () => {
  const userList = useRecoilValue(userListState);

  return (
    <>
      {userList.map((id) => (
        <Measurement key={id} id={id} />
      ))}
    </>
  );
};
