import { FigureToken } from '../doodads/FigureToken';
import { Generator } from '../supply/Generator';

export function GeneratorGroup({ groupKey, generators, selected, setSelected }) {
  const allSelected = generators.every((id) => selected.includes(id));

  const selectedSet = new Set(selected);

  const onAllSelect = function (isSelected) {
    if (isSelected) {
      generators.forEach((g) => selectedSet.add(g));
    } else {
      generators.forEach((g) => selectedSet.delete(g));
    }

    setSelected([...selectedSet]);
  };

  const onOneSelect = function (isSelected, key) {
    if (isSelected) {
      selectedSet.add(key);
    } else {
      selectedSet.delete(key);
    }

    setSelected([...selectedSet]);
  };

  return (
    <div className="generators__group">
      <div className={`generators__select-all ${allSelected ? 'selected' : ''}`} onClick={() => onAllSelect(!allSelected)}>
        <FigureToken prefix="All" label="All" allegiance={groupKey} />
      </div>
      {generators.map((id) => {
        const oneSelected = selected.includes(id);

        return (
          <div key={id} className={`generators__select-one ${oneSelected ? 'selected' : ''}`} onClick={() => onOneSelect(!oneSelected, id)}>
            <Generator id={id} />
          </div>
        );
      })}
    </div>
  );
}
