import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { fullTokenState, selectedTokenIdState, tokenCapabilityState } from '../app/tokenState';
import { useToken } from '../doodads/useToken';
import { useRuler } from '../ruler/useRuler';
import { TokenColorMenu } from './TokenColorMenu';
import { TokenMainMenu } from './TokenMainMenu';
import { TokenSizeMenu } from './TokenSizeMenu';

export function TokenMenu({ id, showMenu }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash, setColor, enlarge, shrink }] = useToken(id);
  const capabilities = useRecoilValue(tokenCapabilityState(id));

  const [activeMenu, setActiveMenu] = useState(MenuType.main);

  useEffect(() => {
    setActiveMenu(MenuType.main);
  }, [setActiveMenu, showMenu]);

  const [, { start }] = useRuler();

  const selectedTokenId = useRecoilValue(selectedTokenIdState);
  const { position } = useRecoilValue(fullTokenState(selectedTokenId!)) || { position: null };

  function handleMove() {
    start({ x: position!.x, y: position!.y - 48 * 1.5 }, position!, selectedTokenId);
  }

  return (
    <AnimatePresence>
      {showMenu && activeMenu === MenuType.main && (
        <TokenMainMenu
          isVisible={visible}
          isActive={active}
          onOpenColorMenu={() => setActiveMenu(MenuType.color)}
          onOpenSizeMenu={() => setActiveMenu(MenuType.size)}
          onSetActiveClicked={setActive}
          onSetVisibleClicked={setVisible}
          onStashTokenClicked={stash}
          onTrashTokenClicked={trash}
          onMoveClicked={handleMove}
          capabilities={capabilities}
        />
      )}
      {showMenu && activeMenu === MenuType.color && capabilities.canColor && <TokenColorMenu closeMenu={() => setActiveMenu(MenuType.main)} setColor={setColor} />}
      {showMenu && activeMenu === MenuType.size && capabilities.canSize && <TokenSizeMenu closeMenu={() => setActiveMenu(MenuType.main)} enlargeToken={enlarge} shrinkToken={shrink} />}
    </AnimatePresence>
  );
}

const MenuType = {
  main: 'main',
  color: 'color',
  size: 'size',
};

type TokenMenuProps = { id: string; showMenu: boolean };
