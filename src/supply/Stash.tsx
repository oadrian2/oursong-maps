import React from 'react';
import { useRecoilValue } from 'recoil';
import { TokenID } from '../api/types';
import { stashedTokenIDsState } from '../app/tokenState';
import { StashedToken } from './StashedToken';
import { StashLabel } from './Supply';
import './Supply.css';

export function Stash() {
  const stashedTokenIDs = useRecoilValue(stashedTokenIDsState);

  return (
    <>
      {stashedTokenIDs.map((id: TokenID) => (
        <StashedToken key={id} id={id} />
      ))}
      {stashedTokenIDs.length === 0 && <StashLabel />}
    </>
  );
}
