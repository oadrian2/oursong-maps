import { ReactNode, useMemo } from 'react';
import { useParams } from 'react-router';
import { ListenInterface, RecoilSync } from 'recoil-sync';

export function RecoilURLRouteSync({ children }: { children: ReactNode }) {
  const params = useParams();

  const read = useMemo(() => (itemKey: string) => params[itemKey], [params]);

  const listen = useMemo(
    () =>
      ({ updateAllKnownItems }: ListenInterface) => {
        updateAllKnownItems(new Map(Object.entries(params)));

        console.log('hur?');
      },
    [params]
  );

  return (
    <RecoilSync storeKey="context" read={read} listen={listen}>
      {children}
    </RecoilSync>
  );
}
