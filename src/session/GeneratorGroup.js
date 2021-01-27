import { NameToken } from '../doodads/NameToken';
import { TokenGroup } from '../supply/TokenGroup';

export function GeneratorGroup({ groupKey, generators, selected, setSelected }) {
  const allSelected = generators.every((id) => selected.includes(id));

  const selectedSet = new Set(selected);

  const onAllSelect = function (newState) {
    if (newState) {
      generators.forEach((g) => selectedSet.add(g));
    } else {
      generators.forEach((g) => selectedSet.delete(g));
    }

    setSelected([...selectedSet]);
  };

  const onOneSelect = function (newState, key) {
    if (newState) {
      selectedSet.add(key);
    } else {
      selectedSet.delete(key);
    }

    setSelected([...selectedSet]);
  };

  return (
    <div className="generators__group">
      <div className={`generators__select-all ${allSelected ? 'selected' : ''}`} onClick={() => onAllSelect(!allSelected)}>
        <NameToken prefix="All" label="All" allegiance={groupKey} />
      </div>
      {generators.map((id) => {
        const oneSelected = selected.includes(id);

        return (
          <div key={id} className={`generators__select-one ${oneSelected ? 'selected' : ''}`} onClick={() => onOneSelect(!oneSelected, id)}>
            <TokenGroup id={id} />
          </div>
        );
      })}
    </div>
  );
}
