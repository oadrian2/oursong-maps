import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { isFigureShape, ItemTypes, TokenID } from '../api/types';
import { generatorState, isControlledGeneratorState } from '../app/mapState';
import { fullTokenState } from '../app/tokenState';
import { SupplyFigure } from './SupplyFigure';

export function StashedToken({ id }: StashTokenProps) {
  const {
    generator: generatorId,
    name,
    label,
    shape: { color },
  } = useRecoilValue(fullTokenState(id))!;

  const generator = useRecoilValue(generatorState(generatorId))!;
  const isClaimed = useRecoilValue(isControlledGeneratorState(generatorId));

  const [, drag, preview] = useDrag({
    type: ItemTypes.STASHED_TOKEN,
    item: { id, type: ItemTypes.STASHED_TOKEN },
    canDrag: () => isClaimed,
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  if (isFigureShape(generator.shape)) {
    return (
      <div ref={drag}>
        <SupplyFigure name={name} label={label} color={color} baseSize={generator.shape.baseSize} />
      </div>
    );
  }

  return null;
}

type StashTokenProps = { id: TokenID };
