import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { isFigureShape, ItemTypes, TokenID } from '../api/types';
import { generatorState, isControlledGeneratorState } from '../app/mapState';
import { tokenIndexState, tokenState } from '../app/tokenState';
import { FigureToken } from '../doodads/FigureToken';

export function StashedToken({ id }: StashTokenProps) {
  const { generator: generatorId } = useRecoilValue(tokenState(id));
  const generator = useRecoilValue(generatorState(generatorId))!;
  const index = useRecoilValue(tokenIndexState(id));
  const isClaimed = useRecoilValue(isControlledGeneratorState(generatorId));

  const [, drag, preview] = useDrag({
    type: ItemTypes.STASHED_TOKEN,
    item: { id, type: ItemTypes.STASHED_TOKEN },
    canDrag: () => isClaimed,
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  if (isFigureShape(generator.shape)) return <FigureToken ref={drag} name={generator.label} {...generator.shape} index={index} />;

  return null;
}

type StashTokenProps = { id: TokenID };
