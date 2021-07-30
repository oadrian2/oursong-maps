import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { Ruler, Token, TokenID, tokenState } from '../map/State';

export function useToken(tokenID:  TokenID): [Token, TokenCommands] {
  const [token, setToken] = useRecoilState(tokenState(tokenID));

  if (!token) throw Error(`Token '${tokenID}' does not exist.`);

  const stash = useCallback(() => setToken(tokenReducer(token, stashAction())), [token, setToken]);
  const trash = useCallback(() => setToken(tokenReducer(token, trashAction())), [token, setToken]);
  const toggleVisible = useCallback(() => setToken(tokenReducer(token, toggleVisibleAction())), [token, setToken]);
  const toggleActive = useCallback(() => setToken(tokenReducer(token, toggleActiveAction())), [token, setToken]);
  const move = useCallback((path: Ruler) => setToken(tokenReducer(token, moveToAction(path))), [token, setToken]);

  return [token, { stash, trash, toggleVisible, toggleActive, move }];
}

type Action<K, P = {}> = { type: K; payload?: P };

type TokenStashAction = Action<'tokenStashed'>;
type TokenTrashAction = Action<'tokenTrashed'>;
type TokenToggleVisibleAction = Action<'tokenVisibleToggled'>;
type TokenToggleActiveAction = Action<'tokenActiveToggled'>;
type TokenMoveAction = Action<'tokenMovedTo', { path: Ruler }>;

type TokenCommands = {
  stash: () => void;
  trash: () => void;
  toggleVisible: () => void;
  toggleActive: () => void;
  move: (path: Ruler) => void;
};

type TokenAction = TokenStashAction | TokenTrashAction | TokenToggleVisibleAction | TokenToggleActiveAction | TokenMoveAction;

function stashAction(): TokenStashAction {
  return { type: 'tokenStashed' };
}

function trashAction(): TokenTrashAction {
  return { type: 'tokenTrashed' };
}

function toggleVisibleAction(): TokenToggleVisibleAction {
  return { type: 'tokenVisibleToggled' };
}

function toggleActiveAction(): TokenToggleActiveAction {
  return { type: 'tokenActiveToggled' };
}

function moveToAction(path: Ruler): TokenMoveAction {
  return { type: 'tokenMovedTo', payload: { path } };
}

function tokenReducer(state: Token, action: TokenAction): Token {
  switch (action.type) {
    case 'tokenStashed': {
      return { ...state, position: null };
    }
    case 'tokenTrashed': {
      return { ...state, deleted: true };
    }
    case 'tokenVisibleToggled': {
      return { ...state, visible: !state.visible };
    }
    case 'tokenActiveToggled': {
      return { ...state, active: !state.active };
    }
    case 'tokenMovedTo': {
      return { ...state, position: null };
    }
    default:
      return state;
  }
}
