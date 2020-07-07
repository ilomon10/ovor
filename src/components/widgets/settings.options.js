import React from 'react';
import { FormGroup, InputGroup, Switch } from '@blueprintjs/core';

const SettingsOptions = ({ label, name, type, value, onChange }) => {
  switch (type) {
    case 'number':
      return (
        <FormGroup
          labelInfo={`(${type})`}
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
      return (<Switch label={`${label} (${type})`} name={name} checked={value}
        onChange={onChange} />);
    default: return type;
  }
}

export default SettingsOptions;