import { useRecoilValue } from 'recoil';
import { claimedFigureGeneratorListState } from '../app/mapState';
import { Generator } from './Generator';
import { ModelsLabel } from './Supply';

export function Figures() {
  const claimedGenereratorIds = useRecoilValue(claimedFigureGeneratorListState);

  if (!claimedGenereratorIds.length) return <ModelsLabel />;

  return (
    <>
      {claimedGenereratorIds.map((id) => (
        <Generator key={id} id={id} />
      ))}
    </>
  );
}
