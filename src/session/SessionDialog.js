import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorsClaimed, selectClaimedGeneratorIds, selectGeneratorsByAllegiance } from '../supply/generatorsSlice';
import { GeneratorGroup } from './GeneratorGroup';
import './SessionDialog.css';

export function SessionDialog() {
  const dispatch = useDispatch();

  const generatorGroups = useSelector(selectGeneratorsByAllegiance);
  const claimedGenerators = useSelector(selectClaimedGeneratorIds);

  const [selected, setSelected] = useState(claimedGenerators);

  const onClick = () => dispatch(generatorsClaimed(selected));

  return (
    <Dialog open={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Claim Characters</DialogTitle>
      <DialogContent>
        <div className="session-dialog__generators">
          {Object.keys(generatorGroups).map((key) => (
            <GeneratorGroup key={key} groupKey={key} generators={generatorGroups[key]} selected={selected} setSelected={setSelected} />
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
