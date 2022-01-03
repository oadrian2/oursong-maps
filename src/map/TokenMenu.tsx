import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { tokenCapabilityState } from '../app/tokenState';
import { useToken } from '../doodads/useToken';
import { TokenColorMenu } from './TokenColorMenu';
import { TokenMainMenu } from './TokenMainMenu';
import { TokenSizeMenu } from './TokenSizeMenu';

export function TokenMenu({ id, showMenu }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash, setColor }] = useToken(id);
  const capabilities = useRecoilValue(tokenCapabilityState(id));

  const [activeMenu, setActiveMenu] = useState(MenuType.main);

  useEffect(() => {
    setActiveMenu(MenuType.main);
  }, [setActiveMenu, showMenu]);

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
          capabilities={capabilities}
        />
      )}
      {showMenu && activeMenu === MenuType.color && (
        <TokenColorMenu closeMenu={() => setActiveMenu(MenuType.main)} setColor={setColor} />
      )}
      {showMenu && activeMenu === MenuType.size && <TokenSizeMenu closeMenu={() => setActiveMenu(MenuType.main)} setSize={() => {}} />}
    </AnimatePresence>
  );
}

const MenuType = {
  main: 'main',
  color: 'color',
  size: 'size',
};

type TokenMenuProps = { id: string; showMenu: boolean };
