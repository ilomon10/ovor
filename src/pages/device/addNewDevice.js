import React, { useState, useCallback, useContext } from 'react';
import { Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect, Button, Callout } from '@blueprintjs/core';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FeathersContext } from 'components/feathers';

const Schema = Yup.object().shape({
  deviceName: Yup.string()
    .min(3, "Too Short!")
    .max(24, "Too Long!")
    .required('Fill this field'),
  deviceFields: Yup.array()
    .min(3, "Min have 2 field")
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

const AddDevice = ({ onClose }) => {
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
          'deviceName': '',
          'deviceFields': [
            { name: 'timestamp', type: 'date', required: true },
            { name: '', type: 'number' }
          ]
        }}
        validationSchema={Schema}
        onSubmit={async (v, { setSubmitting, setErrors }) => {
          const fields = [...v['deviceFields']]
            .map(({ name, type }) => ({
              name, type
            }));
          fields.pop();
          try {
            await feathers.devices().create({
              name: v['deviceName'], fields
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
              label="Device Name"
              labelFor="deviceName"
              intent={errors['deviceName'] ? 'danger' : 'none'}
              helperText={errors['deviceName']}>
              <InputGroup id="deviceName" name="deviceName" type="text"
                intent={errors['deviceName'] ? 'danger' : 'none'}
                value={values['deviceName']}
                onChange={handleChange} />
            </FormGroup>
            <FormGroup
              label="Fields"
              labelInfo={`(${values['deviceFields'].length - 1})`}
              intent={errors['deviceFields'] ? 'danger' : 'none'}
              helperText={errors['deviceFields']}>
              <FieldArray
                name={'deviceFields'}
                render={arr => values['deviceFields'].map((v, i) => (
                  <div key={i} className="flex" style={{ marginBottom: i !== values['deviceFields'].length - 1 ? 12 : 0 }}>
                    <ControlGroup fill className="flex-grow">
                      <InputGroup
                        name={`deviceFields[${i}].name`}
                        type="text" value={v.name}
                        readOnly={values['deviceFields'][i].required}
                        onChange={e => {
                          setFieldValue(`deviceFields[${i}].name`, '');
                          handleChange(e);
                          if (i === values['deviceFields'].length - 1) arr.push({ name: '', type: 'string' })
                        }}
                        placeholder={i === values['deviceFields'].length - 1 ? "Enter a new field name" : null} />
                      <HTMLSelect
                        name={`deviceFields[${i}].type`}
                        disabled={values['deviceFields'][i].required}
                        onChange={handleChange} value={v.type} options={fieldType} />
                    </ControlGroup>
                    <Button minimal icon="trash" intent={(i === values['deviceFields'].length - 1) || values['deviceFields'][i].required ? null : "danger"}
                      onClick={() => arr.remove(i)}
                      disabled={(i === values['deviceFields'].length - 1) || values['deviceFields'][i].required} />
                  </div>
                ))} />
            </FormGroup>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button text="Close" onClick={cancle} minimal intent="danger" />
              <Button text="Create" intent="primary"
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

export default AddDevice;