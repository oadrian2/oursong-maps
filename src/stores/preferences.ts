import { atom } from 'recoil';

export const themeColorState = atom({
  key: 'ThemeColor',
  default: window?.matchMedia('(prefers-color-scheme: dark').matches ?? false ? 'dark' : 'light',
});
