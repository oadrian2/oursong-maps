import { useEffect, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { ItemTypes } from '../ItemTypes';
import { NameToken } from './NameToken';
import { selectTokenById, selectIndexWithinGroup } from './tokenSlice';

export default function Token({ id }) {
  const {
    group,
    shape: { prefix, label, allegiance, radius = 30 },
  } = useSelector((state) => selectTokenById(state, id));

  const params = useMemo(() => ({ id, group }), [id, group])

  const index = useSelector((state) => selectIndexWithinGroup(state, params));

  console.log(group, index);

  const effectivePrefix = prefix.replace('#', '');
  const effectiveIndex = prefix.indexOf('#') === -1 ? index : index + 1;
  const numberedLabel = effectiveIndex ? `${effectivePrefix}${effectiveIndex}` : effectivePrefix;
  const numberedTitle = effectiveIndex ? `${label} ${effectiveIndex}` : label;

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.TOKEN, id },
    collect: () => ({}),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return <NameToken ref={drag} label={numberedLabel} title={numberedTitle} allegiance={allegiance} radius={radius} />;
}
