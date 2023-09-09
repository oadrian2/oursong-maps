import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { fullTokenState, tokenCapabilityState } from '../app/tokenState';
import { useToken } from '../doodads/useToken';
import { useRuler } from '../ruler/useRuler';
import { TokenAuraMenu } from './TokenAuraMenu';
import { TokenColorMenu } from './TokenColorMenu';
import { TokenMainMenu } from './TokenMainMenu';
import { TokenSizeMenu } from './TokenSizeMenu';

export function TokenMenu({ id, showMenu }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash, setColor, enlarge, shrink, enlargeAura, shrinkAura }] = useToken(id);
  
  const capabilities = useRecoilValue(tokenCapabilityState(id));

  const [activeMenu, setActiveMenu] = useState(MenuType.main);

  useEffect(() => {
    setActiveMenu(MenuType.main);
  }, [setActiveMenu, showMenu]);

  const [, { start }] = useRuler();

  const { position } = useRecoilValue(fullTokenState(id)) || { position: null };

  function handleMove() {
    start({ x: position!.x, y: position!.y - 48 * 1.5 }, position!, id);
  }

  return (
    <AnimatePresence>
      {showMenu && activeMenu === MenuType.main && (
        <TokenMainMenu
          isVisible={visible}
          isActive={active}
          onOpenColorMenu={() => setActiveMenu(MenuType.color)}
          onOpenAuraMenu={() => setActiveMenu(MenuType.aura)}
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
      {showMenu && activeMenu === MenuType.aura && capabilities.canChangeAura && <TokenAuraMenu closeMenu={() => setActiveMenu(MenuType.main)} enlargeAura={enlargeAura} shrinkAura={shrinkAura} />}
    </AnimatePresence>
  );
}

const MenuType = {
  main: 'main',
  color: 'color',
  size: 'size',
  aura: 'aura',
};

type TokenMenuProps = { id: string; showMenu: boolean };
