import { useEffect, useRef, useState } from 'react';
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

  const ref = useRef();

  useEffect(() => {
      ref.current.showModal();
  }, [])

  return (
    <dialog ref={ref} className="session-dialog">
      <div className="session-dialog__generators">
        {Object.keys(generatorGroups).map((key) => (
          <GeneratorGroup key={key} groupKey={key} generators={generatorGroups[key]} selected={selected} setSelected={setSelected} />
        ))}
      </div>
      <div className="session-dialog__footer">
        <button className="session-dialog__submit" type="button" onClick={onClick}>
          Okay
        </button>
      </div>
    </dialog>
  );
}