import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { GeneratorID, TokenColor } from '../api/types';
import { TokenBase } from '../doodads/TokenBase';
import { Generator } from '../supply/Generator';

export function GeneratorGroup({ groupKey, generators, selected, setSelected }: GeneratorGroupProps) {
  const allSelected = generators.every((id: string) => selected.includes(id));

  const selectedSet = new Set(selected);

  const onSelect = function (generators: GeneratorID[], isSelected: boolean) {
    if (isSelected) {
      generators.forEach((g: string) => selectedSet.add(g));
    } else {
      generators.forEach((g: string) => selectedSet.delete(g));
    }

    setSelected(Array.from(selectedSet));
  };

  return (
    <Box display="flex">
      <Box mr={1}>
        <ToggleRing selected={allSelected} onChange={(value: boolean) => onSelect(generators, value)}>
          <TokenBase title="All" color={groupKey}>
            All
          </TokenBase>
        </ToggleRing>
      </Box>
      <Box display="flex" flexWrap="wrap">
        {generators.map((id: string) => {
          const oneSelected = selected.includes(id);

          return (
            <ToggleRing key={id} selected={oneSelected} onChange={(value: boolean) => onSelect([id], value)}>
              <Generator id={id} />
            </ToggleRing>
          );
        })}
      </Box>
    </Box>
  );
}

type GeneratorGroupProps = {
  groupKey: TokenColor;
  generators: string[];
  selected: string[];
  setSelected: (items: string[]) => void;
};

export function ToggleRing({ children, selected, onChange }: ToggleRingProps) {
  return (
    <div className={`generators__select-one ${selected ? 'selected' : ''}`} onClick={() => onChange(!selected)}>
      {children}
    </div>
  );
}

export type ToggleRingProps = {
  children: ReactNode;
  selected: boolean;
  onChange: (value: boolean) => void;
};
