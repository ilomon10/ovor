import React, { useState, useCallback } from 'react';
import { Classes, FormGroup, ControlGroup, InputGroup, HTMLSelect, Button } from '@blueprintjs/core';
import { GRAPH_TYPE } from './constants';
import { generateUniqueId } from 'components/helper';

const Settings = ({ onClose, ...props }) => {
  const [title, setTitle] = useState(props.title || "");
  const [series, setSeries] = useState([{ unique: generateUniqueId(), device: "0", field: undefined }]);
  const onChange = useCallback((which, id, e) => {
    console.log(e.target.value);
    let arr = [...series];
    arr[id] = {
      ...arr[id],
      [which]: e.target.value
    }
    if (arr[series.length - 1].device !== "0") {
      arr.push({ unique: generateUniqueId(), device: "0", field: undefined });
    }
    setSeries([...arr]);
  }, [series]);
  const removeSeries = useCallback((unique) => {
    let arr = [...series];
    setSeries([...arr.filter((v) => v.unique !== unique)])
  }, [series])
  const cancle = useCallback(() => {
    onClose();
  }, [onClose])
  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          label="Title"
          labelInfo="(required)">
          <InputGroup type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </FormGroup>
        <FormGroup
          label="Type">
          <HTMLSelect fill options={Object.keys(GRAPH_TYPE).map((v) => ({ label: v, value: GRAPH_TYPE[v] }))} />
        </FormGroup>
        <FormGroup
          label="Series"
          labelInfo={`(${series.length - 1})`}>
          {series.map((v, i) => (
            <div key={v.unique} className="flex" style={{ marginBottom: i !== series.length - 1 ? 12 : 0 }} >
              <ControlGroup fill className="flex-grow">
                <HTMLSelect options={[{ label: "Choose device", value: "0" }, "Sensor Debu"]}
                  value={v.device}
                  onChange={onChange.bind(this, 'device', i)} />
                <HTMLSelect options={[{ label: "Choose field", value: "0" }, "O2"]}
                  value={v.field}
                  disabled={v.device === "0"}
                  onChange={onChange.bind(this, 'field', i)} />
              </ControlGroup>
              <Button minimal icon="trash" intent={i === series.length - 1 ? null : 'danger'}
                onClick={removeSeries.bind(this, v.unique)}
                disabled={i === series.length - 1} />
            </div>
          ))}
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Close" minimal intent="danger"
            onClick={cancle} />
          <Button text="Save" intent="success" />
        </div>
      </div>
    </>
  )
}

export default Settings;