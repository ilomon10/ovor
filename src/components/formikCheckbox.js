import React from 'react';
import { Field } from 'formik';
import { Checkbox as BPCheckbox } from '@blueprintjs/core';

const Checkbox = ({ onChange, ...props }) => {
  return (<Field name={props.name}>
    {({ field, form }) => (
      <BPCheckbox
        {...props}
        checked={field.value.includes(props.value)}
        onChange={(e) => {
          if (field.value.includes(props.value)) {
            const nextValue = field.value.filter(value => value !== props.value);
            form.setFieldValue(props.name, nextValue);
          } else {
            const nextValue = field.value.concat(props.value);
            form.setFieldValue(props.name, nextValue);
          }
          if (typeof onChange === 'function') onChange(e);
        }}
      />
    )}
  </Field>);
}

export default Checkbox;