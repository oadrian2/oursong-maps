import React from 'react';
import { useRecoilValue } from 'recoil';
import { stashedTokenIDsState, TokenID } from '../app/tokenState';
import { StashedToken } from './StashedToken';
import './Supply.css';

export function Stash() {
  const stashedTokenIDs = useRecoilValue(stashedTokenIDsState);

  return (
    <>
      {stashedTokenIDs.map((id: TokenID) => (
        <StashedToken key={id} id={id} />
      ))}
      {stashedTokenIDs.length === 0 && <div className="token-container-empty-label">Stash</div>}
    </>
  );
}
