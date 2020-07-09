import React from 'react';
import { FormGroup, InputGroup, Switch, HTMLSelect } from '@blueprintjs/core';

const SettingsOptions = ({ label, name, type, value, onChange }) => {
  switch (type.type) {
    case 'number':
      return (
        <FormGroup
          labelInfo={`(${type.type})`}
          labelFor={`option-${name}`}
          label={label}>
          <InputGroup
            onChange={onChange}
            id={`option-${name}`}
            name={name}
            value={value}
            type="number" />
        </FormGroup>);
    case 'boolean':
      return (<Switch label={`${label} (${type.type})`} name={name} checked={value}
        onChange={onChange} />);
    case 'oneOf':
      return (
        <FormGroup
          labelInfo={`(${type.type})`}
          labelFor={`option-${name}`}
          label={label}>
          <HTMLSelect
            name={name}
            value={value}
            onChange={onChange}
            options={type.options} />
        </FormGroup>);
    default: return type;
  }
}

export default SettingsOptions;