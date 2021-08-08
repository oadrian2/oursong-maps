import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { claimedFigureGeneratorListState, generatorsByAllegianceState } from '../app/mapState';
import { TokenAllegiance } from '../app/tokenState';
import { GeneratorGroup } from './GeneratorGroup';
import './SessionDialog.css';

export function SessionDialog() {
  const generatorGroups = useRecoilValue(generatorsByAllegianceState);
  const [claimedIDs, setClaimedIDs] = useRecoilState(claimedFigureGeneratorListState);
  const [selectedIDs, setSelectedIDs] = useState(claimedIDs);

  const handleClaimClick = () => {
    setClaimedIDs(selectedIDs);
  };

  return (
    <Dialog open={claimedIDs.length === 0} aria-labelledby="session-dialog-title">
      <DialogTitle id="session-dialog-title">Claim Models</DialogTitle>
      <DialogContent>
        <div className="session-dialog__generators">
          {Object.keys(generatorGroups).map((key) => (
            <GeneratorGroup
              key={key}
              groupKey={key as TokenAllegiance}
              generators={generatorGroups[key as TokenAllegiance]}
              selected={selectedIDs}
              setSelected={setSelectedIDs}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClaimClick} color="primary">
          Claim
        </Button>
      </DialogActions>
    </Dialog>
  );
}
