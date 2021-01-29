import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { FigureToken } from '../doodads/FigureToken';
import { selectClaimedGeneratorIds, selectGeneratorById } from '../supply/generatorsSlice';
import { selectIndexWithinGroup, selectTokenById } from './tokenSlice';

export function Token({ id, dragType }) {
  const { group: generatorId } = useSelector((state) => selectTokenById(state, id));

  const {
    shape: { prefix, label, isGroup, allegiance, radius = 1 },
  } = useSelector((state) => selectGeneratorById(state, generatorId));

  const index = useSelector((state) => selectIndexWithinGroup(state, { id, group: generatorId }));

  const claimedGeneratorIds = useSelector(selectClaimedGeneratorIds);

  const effectivePrefix = prefix;
  const effectiveIndex = isGroup ? index + 1 : index;
  const numberedLabel = effectiveIndex ? `${effectivePrefix}${effectiveIndex}` : effectivePrefix;
  const numberedTitle = effectiveIndex ? `${label} ${effectiveIndex}` : label;

  const [, drag, preview] = useDrag({
    item: { type: dragType, id },
    collect: () => ({ dragType }),
    canDrag: () => claimedGeneratorIds.includes(generatorId),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return <FigureToken ref={drag} label={numberedLabel} title={numberedTitle} allegiance={allegiance} radius={radius} />;
}
