import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useToken } from '../doodads/useToken';
import { TokenColorMenu } from './TokenColorMenu';
import { TokenMainMenu } from './TokenMainMenu';
import { TokenSizeMenu } from './TokenSizeMenu';

export function TokenMenu({ id, showMenu }: TokenMenuProps) {
  const [{ active = true, visible = true }, { setVisible, setActive, stash, trash, setColor }] = useToken(id);

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
          openColorMenu={() => setActiveMenu(MenuType.color)}
          openSizeMenu={() => setActiveMenu(MenuType.size)}
          setActive={setActive}
          setVisible={setVisible}
          stashToken={stash}
          trashToken={trash}
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
