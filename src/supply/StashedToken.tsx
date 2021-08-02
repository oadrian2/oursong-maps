import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { generatorState, isControlledGeneratorState, isFigureGenerator } from '../app/mapState';
import { RootState } from '../app/store';
import { FigureToken } from '../doodads/FigureToken';
import { ItemTypes } from '../ItemTypes';
import { selectIndexWithinGroup, selectTokenById, TokenID } from '../map/tokenSlice';

export function StashedToken({ id }: StashTokenProps) {
  const { generator: generatorId } = useSelector((state: RootState) => selectTokenById(state, id)!);
  const generator = useRecoilValue(generatorState(generatorId))!;

  const index = useSelector((state: RootState) => selectIndexWithinGroup(state, { id, generator: generatorId }));

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
