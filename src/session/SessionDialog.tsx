import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TokenAllegiance } from '../map/tokenSlice';
import { generatorsClaimed, selectClaimedGeneratorIds, selectGeneratorsByAllegiance } from '../supply/generatorsSlice';
import { GeneratorGroup } from './GeneratorGroup';
import './SessionDialog.css';

export function SessionDialog() {
  const dispatch = useDispatch();

  const generatorGroups = useSelector(selectGeneratorsByAllegiance);
  const claimedGeneratorIds = useSelector(selectClaimedGeneratorIds);

  const [selected, setSelected] = useState(claimedGeneratorIds);

  const onClick = () => dispatch(generatorsClaimed(selected));

  return (
    <Dialog open={claimedGeneratorIds.length === 0} aria-labelledby="session-dialog-title">
      <DialogTitle id="session-dialog-title">Claim Models</DialogTitle>
      <DialogContent>
        <div className="session-dialog__generators">
          {Object.keys(generatorGroups).map((key) => (
            <GeneratorGroup
              key={key}
              groupKey={key as TokenAllegiance}
              generators={generatorGroups[key as TokenAllegiance]}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClick} color="primary">
          Claim
        </Button>
      </DialogActions>
    </Dialog>
  );
}
