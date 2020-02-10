import React, { useCallback, useState } from 'react';
import { Classes, Button, FormGroup, InputGroup, RadioGroup, Radio, HTMLSelect } from '@blueprintjs/core';

const AddNewDashboard = ({ onClose }) => {
  const [sending, setSending] = useState(false);
  const [choice, setChoice] = useState("1");
  const createDashboard = useCallback(() => {
    setSending(true);
    // onClose();
  }, [setSending]);
  const cancel = useCallback(() => {
    onClose();
  }, [onClose])
  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <RadioGroup onChange={(e) => setChoice(e.target.value)} selectedValue={choice}>
          <Radio label="Copy from existing" value="0" />
          <FormGroup
            disabled={choice !== "0"}
            labelFor="dashboard-exist">
            <HTMLSelect fill id="dashboard-exist"
              disabled={choice !== "0"}
              name="dashboard-exist" options={["Temperature at home", "Present statistic"]} />
          </FormGroup>
          <Radio label="Create new" value="1" />
          <FormGroup
            disabled={choice !== "1"}
            labelFor="dashboard-title">
            <InputGroup id="dashboard-title"
              disabled={choice !== "1"}
              name="dashboard-title" type="text"
              placeholder="Enter a new dashboard Title" />
          </FormGroup>
        </RadioGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button minimal
            onClick={cancel}
            text="Close" intent="danger" />
          <Button text="Create"
            loading={sending}
            intent="primary"
            onClick={createDashboard} />
        </div>
      </div>
    </>
  )
}

export default AddNewDashboard;