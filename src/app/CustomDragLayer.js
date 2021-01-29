import { useMemo } from 'react';
import { useDragLayer } from 'react-dnd';
import { Token } from '../map/Token';
import { ItemTypes } from '../ItemTypes';
import { TokenGroup } from '../supply/FigureGenerator';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  return { transform: `translate(${x}px, ${y}px)` };
}

export const CustomDragLayer = (props) => {
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
        return <Token id={item.id} dragType={ItemTypes.PLACED_TOKEN} />;
      case ItemTypes.STASHED_TOKEN:
        return <Token id={item.id} dragType={ItemTypes.STASHED_TOKEN} />;
      case ItemTypes.GENERATOR:
        return <TokenGroup id={item.id} />;
      default:
        return null;
    }
  }, [itemType, item]);

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}>{renderedItem}</div>
    </div>
  );
};
