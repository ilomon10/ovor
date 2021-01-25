import React from 'react';
import { FormGroup, InputGroup, Switch, HTMLSelect } from '@blueprintjs/core';
import FileInput from "./settings.options.file";

const Form = ({ label, name, type, value, onChange }) => {
  switch (type.type) {
    case 'string':
      return (<InputGroup
        onChange={onChange}
        id={`option-${name}`}
        name={name}
        value={value}
        type="text" />);
    case 'number':
      return (<InputGroup
        step="any"
        onChange={onChange}
        id={`option-${name}`}
        name={name}
        value={Number(value) || undefined}
        type="number" />);
    case 'boolean':
      return (<Switch label={`${label} (${type.type})`} name={name} default checked={value}
        onChange={(e) => {
          e.target.value = Boolean(e.target.value);
          onChange(e);
        }} />);
    case 'oneOf':
      return (<HTMLSelect
        name={name}
        value={value}
        onChange={onChange}
        options={type.options} />);
    case 'file':
      return (<FileInput
        name={name}
        value={value}
      />)
    default: return type;
  }
}

const SettingsOptions = ({ noFormGroup = false, ...props }) => {
  if (noFormGroup) return (<Form {...props} />);

  return (
    <FormGroup
      labelInfo={`(${props.type.type})`}
      labelFor={`option-${props.name}`}
      label={props.label}>
      <Form {...props} />
    </FormGroup>
  )
}

export default SettingsOptions;