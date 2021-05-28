import styled from '@emotion/styled';
import { useMemo } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import { ItemTypes } from '../ItemTypes';
import { PlacedToken } from '../map/PlacedToken';
import { Generator } from '../supply/Generator';
import { StashedToken } from '../supply/StashedToken';

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  return { transform: `translate(${x}px, ${y}px)` };
}

export function CustomDragLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const renderedItem = useMemo(() => {
    switch (itemType) {
      case ItemTypes.PLACED_TOKEN:
        return <PlacedToken id={item.id} />;
      case ItemTypes.STASHED_TOKEN:
        return <StashedToken id={item.id} />;
      case ItemTypes.GENERATOR:
        return <Generator id={item.id} />;
      default:
        return null;
    }
  }, [itemType, item]);

  if (!isDragging) {
    return null;
  }

  return (
    <DragLayer>
      <div style={getItemStyles(initialOffset, currentOffset)}>{renderedItem}</div>
    </DragLayer>
  );
}

const DragLayer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;
