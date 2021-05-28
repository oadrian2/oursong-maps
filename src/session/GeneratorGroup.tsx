import { FigureToken } from '../doodads/FigureToken';
import { Generator } from '../supply/Generator';
import { TokenAllegiance } from '../map/tokenSlice';

export function GeneratorGroup({ groupKey, generators, selected, setSelected }: GeneratorGroupProps) {
  const allSelected = generators.every((id: string) => selected.includes(id));

  const selectedSet = new Set(selected);

  const onAllSelect = function (isSelected: boolean) {
    if (isSelected) {
      generators.forEach((g: string) => selectedSet.add(g));
    } else {
      generators.forEach((g: string) => selectedSet.delete(g));
    }

    setSelected(Array.from(selectedSet.values()));
  };

  const onOneSelect = function (isSelected: boolean, key: string) {
    if (isSelected) {
      selectedSet.add(key);
    } else {
      selectedSet.delete(key);
    }

    setSelected(Array.from(selectedSet));
  };

  return (
    <div className="generators__group">
      <div className={`generators__select-all ${allSelected ? 'selected' : ''}`} onClick={() => onAllSelect(!allSelected)}>
        <FigureToken prefix="All" label="All" allegiance={groupKey} index={0} isGroup={false} overlay={null} isTemplate />
      </div>
      {generators.map((id: string) => {
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

type GeneratorGroupProps = {
  groupKey: TokenAllegiance;
  generators: string[];
  selected: string[];
  setSelected: (items: string[]) => void;
};
