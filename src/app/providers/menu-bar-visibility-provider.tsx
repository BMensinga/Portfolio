'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type MenuBarVisibilityContextValue = {
  isIntroInView: boolean;
  setIntroInView: (value: boolean) => void;
};

const MenuBarVisibilityContext = createContext<MenuBarVisibilityContextValue | undefined>(
  undefined,
);

export function MenuBarVisibilityProvider({ children }: { children: ReactNode }) {
  const [isIntroInView, setIsIntroInView] = useState(true);

  const setIntroInView = useCallback((value: boolean) => {
    setIsIntroInView((current) => (current === value ? current : value));
  }, []);

  const value = useMemo(
    () => ({
      isIntroInView,
      setIntroInView,
    }),
    [isIntroInView, setIntroInView],
  );

  return (
    <MenuBarVisibilityContext.Provider value={value}>
      {children}
    </MenuBarVisibilityContext.Provider>
  );
}

export function useMenuBarVisibility() {
  const context = useContext(MenuBarVisibilityContext);

  if (!context) {
    throw new Error('useMenuBarVisibility must be used within a MenuBarVisibilityProvider');
  }

  return context;
}
