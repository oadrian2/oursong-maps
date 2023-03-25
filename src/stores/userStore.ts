import { atom, selector } from 'recoil';

export const meState = atom<ClientPrinciple | null>({
  key: 'Me',
  default: selector<ClientPrinciple | null>({
    key: 'Me/Default',
    get: async () => {
      const response = await fetch('/.auth/me');
      const payload = await response.json();

      const { clientPrincipal } = payload;

      return clientPrincipal;
    },
  }),
});

type ClientPrinciple = {
  userId: string;
  userRoles: string[];
  claims: string[];
  identityProvider: string;
  userDetails: string;
};
