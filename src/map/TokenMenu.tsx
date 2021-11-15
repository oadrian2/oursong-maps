import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useToken } from '../doodads/useToken';
import { TokenColorMenu } from './TokenColorMenu';
import { TokenMainMenu } from './TokenMainMenu';
import { TokenSizeMenu } from './TokenSizeMenu';

export function TokenMenu({ id, showMenu }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash, setColor }] = useToken(id);

  const [activeMenu, setActiveMenu] = useState(MenuType.main);

  return (
    <AnimatePresence>
      {showMenu && activeMenu === MenuType.main && (
        <TokenMainMenu
          isVisible={visible}
          isActive={active}
          openColorMenu={() => setActiveMenu(MenuType.color)}
          openSizeMenu={() => setActiveMenu(MenuType.size)}
          setActive={setActive}
          setVisible={setVisible}
          stashToken={stash}
          trashToken={trash}
        />
      )}
      {showMenu && activeMenu === MenuType.color && (
        <TokenColorMenu onCloseMenu={() => setActiveMenu(MenuType.main)} onSetColor={setColor} />
      )}
      {showMenu && activeMenu === MenuType.size && <TokenSizeMenu onCloseMenu={() => setActiveMenu(MenuType.main)} onSetSize={() => {}} />}
    </AnimatePresence>
  );
}

const MenuType = {
  main: 'main',
  color: 'color',
  size: 'size',
};

type TokenMenuProps = { id: string; showMenu: boolean };
