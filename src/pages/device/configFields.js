import React, { useState, useCallback, useContext } from 'react';
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import { v4 as UUIDV4 } from 'uuid';
import { Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect, Button, Callout } from '@blueprintjs/core';

import { FeathersContext } from 'components/feathers';

const Schema = Yup.object().shape({
  fields: Yup.array()
    .min(2, "Min have 1 field")
    .test('test', 'Please leave no one empty (except last one)', function (value) {
      const scheme = Yup.object().shape({
        name: Yup.string()
          .min(3, "Too Short!")
          .max(16, "Too Long!")
          .required('Req'),
        type: Yup.string().required('Req'),
      })
      for (let i = 0; i < value.length - 1; i++) {
        if (!scheme.isValidSync(value[i])) {
          return false;
        }
      }
      return true
    })
})

const ConfigFields = ({ data, onClose }) => {
  const fieldType = [
    { label: 'Number', value: 'number' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Text', value: 'string' },
    { label: 'Date Time', value: 'date' },
  ];
  const feathers = useContext(FeathersContext);
  const [sending, setSending] = useState(false);
  const cancle = useCallback(() => {
    onClose();
    setSending(false);
  }, [onClose]);
  return (
    <>
      <Formik
        initialValues={{
          'fields': [
            ...data.fields.map((f) => {
              if (f.name === 'timestamp') f.required = true;
              return f;
            }),
            { name: '', type: 'number' }
          ]
        }}
        validationSchema={Schema}
        onSubmit={async (v, { setSubmitting, setErrors }) => {
          const fields = [...v['fields']]
            .map(({ name, type, _id }) => ({
              name, type, _id: _id || UUIDV4()
            }));
          fields.pop();
          try {
            await feathers.devices.patch(data['_id'], {
              $set: { fields }
            });
            onClose();
          } catch (e) {
            console.error(e);
            setErrors({ submit: e.message });
            setSubmitting(false);
          }
        }}>
        {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (<form onSubmit={handleSubmit}>
          {errors.submit &&
            <Callout intent="danger" style={{ marginBottom: 15 }}>
              {errors.submit}
            </Callout>}
          <div className={Classes.DIALOG_BODY}>
            <FormGroup
              label="Fields"
              labelInfo={`(${values['fields'].length - 1})`}
              intent={errors['fields'] ? 'danger' : 'none'}
              helperText={errors['fields']}>
              <FieldArray
                name={'fields'}
                render={arr => values['fields'].map((v, i) => (
                  <div key={i} className="flex" style={{ marginBottom: i !== values['fields'].length - 1 ? 12 : 0 }}>
                    <ControlGroup fill className="flex-grow">
                      <InputGroup
                        name={`fields[${i}].name`}
                        type="text" value={v.name}
                        readOnly={values['fields'][i].required}
                        onChange={e => {
                          setFieldValue(`fields[${i}].name`, '');
                          handleChange(e);
                          if (i === values['fields'].length - 1) arr.push({ name: '', type: 'string' })
                        }}
                        placeholder={i === values['fields'].length - 1 ? "Enter a new field name" : null} />
                      <HTMLSelect
                        name={`fields[${i}].type`}
                        disabled={values['fields'][i].required}
                        onChange={handleChange} value={v.type} options={fieldType} />
                    </ControlGroup>
                    <Button minimal icon="trash" intent={(i === values['fields'].length - 1) || values['fields'][i].required ? null : "danger"}
                      onClick={() => arr.remove(i)}
                      disabled={(i === values['fields'].length - 1) || values['fields'][i].required} />
                  </div>
                ))} />
            </FormGroup>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button text="Close" onClick={cancle} minimal intent="danger" />
              <Button text="Update" intent="primary"
                loading={sending}
                disabled={Object.entries(errors).length > 0}
                type="submit" />
            </div>
          </div>
        </form>)}
      </Formik>
    </>
  )
}

export default ConfigFields;