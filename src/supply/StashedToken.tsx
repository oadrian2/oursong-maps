import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useRecoilValue } from 'recoil';
import { isFigureGenerator, ItemTypes, TokenID } from '../api/types';
import { generatorState, isControlledGeneratorState } from '../app/mapState';
import { tokenIndex, tokenState } from '../app/tokenState';
import { FigureToken } from '../doodads/FigureToken';

export function StashedToken({ id }: StashTokenProps) {
  const { generator: generatorId } = useRecoilValue(tokenState(id));
  const generator = useRecoilValue(generatorState(generatorId))!;
  const index = useRecoilValue(tokenIndex(id));
  const isClaimed = useRecoilValue(isControlledGeneratorState(generatorId));

  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.STASHED_TOKEN, id },
    canDrag: () => isClaimed,
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  if (isFigureGenerator(generator)) return <FigureToken ref={drag} {...generator.shape} index={index} />;

  return null;
}

type StashTokenProps = { id: TokenID };
