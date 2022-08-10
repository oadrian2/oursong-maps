import { selector } from 'recoil';

export const meState = selector<any>({
  key: 'Me',
  get: async () => {
    const response = await fetch('/.auth/me');
    return await response.json();
  },
});
