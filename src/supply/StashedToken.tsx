import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { isFigureShape, ItemTypes, TokenID } from '../api/types';
import { baseDefaultState } from '../app/campaignState';
import { isControlledGeneratorState } from '../app/mapState';
import { fullTokenState } from '../app/tokenState';
import { SupplyFigureToken } from '../doodads/FigureToken';

export function StashedToken({ id }: StashTokenProps) {
  const { generator: generatorId, name, label, shape } = useRecoilValue(fullTokenState(id))!;

  const isClaimed = useRecoilValue(isControlledGeneratorState(generatorId));
  const baseDefault = useRecoilValue(baseDefaultState);

  const [, drag, preview] = useDrag({
    type: ItemTypes.STASHED_TOKEN,
    item: { id, type: ItemTypes.STASHED_TOKEN },
    canDrag: () => isClaimed,
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  if (isFigureShape(shape)) {
    return (
      <div ref={drag}>
        <SupplyFigureToken name={name} label={label} color={shape.color} baseSize={shape.baseSize} baseSizeInvisible={shape.baseSize === baseDefault} />
      </div>
    );
  }

  return null;
}

type StashTokenProps = { id: TokenID };
