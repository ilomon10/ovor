import React, { useState, useCallback } from 'react';
import { Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect, Button } from '@blueprintjs/core';
import { generateUniqueId } from '../../components/helper';

const AddDevice = ({ onClose }) => {
  const fieldType = [
    { label: 'Text', value: 1 },
    { label: 'Date Time', value: 2 },
    { label: 'Number', value: 3 },
  ]
  const [fields, setFields] = useState([
    { unique: generateUniqueId(), name: '', type: 1 }
  ]);
  const [sending, setSending] = useState(false);
  const onChange = useCallback((which, id, e) => {
    let arr = [...fields];
    arr[id] = {
      ...arr[id],
      [which]: e.target.value
    }
    if (arr[fields.length - 1].name) {
      arr.push({ unique: generateUniqueId(), name: '', type: 1 });
    }
    setFields([...arr])
  }, [fields]);
  const removeField = useCallback((unique) => {
    let arr = [...fields];
    setFields([...arr.filter((v) => v.unique !== unique)])
  }, [fields])
  const createDevice = useCallback(() => {
    setSending(true);
    // onClose();
    console.log(fields);
  }, [fields]);
  const cancle = useCallback(() => {
    onClose();
    setSending(false);
  }, [fields])
  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          label="Device Name"
          labelFor="device-name">
          <InputGroup id="device-name" name="device-name" type="text" />
        </FormGroup>
        <FormGroup
          label="Fields">
          {fields.map((v, i) => (
            <div key={v.unique} className="flex" style={{ marginBottom: i !== fields.length - 1 ? 12 : 0 }}>
              <ControlGroup fill className="flex-grow">
                <InputGroup type="text" onChange={onChange.bind(this, 'name', i)} value={v.name} placeholder={i === fields.length - 1 ? "Enter a new field name" : null} />
                <HTMLSelect type="text" onChange={onChange.bind(this, 'type', i)} value={v.type} options={fieldType} />
              </ControlGroup>
              <Button minimal icon="trash" intent={i === fields.length - 1 ? null : "danger"}
                onClick={removeField.bind(this, v.unique)}
                disabled={i === fields.length - 1} />
            </div>
          ))}
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Close" onClick={cancle} />
          <Button text="Create" onClick={createDevice} loading={sending} />
        </div>
      </div>
    </>
  )
}

export default AddDevice;