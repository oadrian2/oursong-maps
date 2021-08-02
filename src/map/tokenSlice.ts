import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { Point } from '../app/math';
import { RootState } from '../app/store';

export enum TokenAllegiance {
  Ally = 'ally',
  Enemy = 'enemy',
  Target = 'target',
  Unknown = 'unknown',
}

export type TokenID = string;

export interface Token {
  id: TokenID;
  generator: string;
  position: Point | null;
  deleted?: boolean;
  visible?: boolean;
  active?: boolean;
  facing?: number;
  path?: Point[];
}

const adapter = createEntityAdapter<Token>();

type TokenState = {
  active: TokenID | null;
  moving: TokenID | null;
  baseSize: {
    default: number;
    unit: 'mm' | 'yd';
    options: number[];
  };
};

const initialState = adapter.getInitialState<TokenState>({
  active: null,
  moving: null,
  baseSize: { default: 30, unit: 'mm', options: [30, 40, 50] },
});

const slice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    tokenUpsert: adapter.upsertOne,
    tokensUpdated: adapter.upsertMany,
  },
});

export const { tokenUpsert, tokensUpdated } = slice.actions;

export default slice.reducer;

export const { selectAll: selectAllTokens, selectById: selectTokenById } = adapter.getSelectors((state: RootState) => state.tokens);

export const selectIndexWithinGroup = createSelector(
  [selectAllTokens, (state: RootState, { id, generator }: { id: TokenID; generator: string }) => ({ id, generator })],
  (tokens, { id, generator }) => tokens.filter((t) => t.generator === generator).findIndex((t) => t.id === id)
);
