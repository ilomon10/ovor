import React, { useState, useCallback, useContext } from 'react';
import { Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect, Button, Callout } from '@blueprintjs/core';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FeathersContext } from 'components/feathers';
import _get from "lodash.get";

const Schema = Yup.object().shape({
  deviceName: Yup.string()
    .min(3, "Too Short!")
    .max(24, "Too Long!")
    .required('Fill this field'),
  deviceFields: Yup.array()
    .transform((arr) => {
      arr.pop();
      return arr;
    })
    .min(2, "Minimal have 2 field")
    .max(10, "Maximum have 10 field")
    .of(Yup.object().shape({
      name: Yup.string()
        .min(3, "Too short!")
        .max(16, "Too long!")
        .required('Required'),
      type: Yup.string().required('Req')
    }))
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
            await feathers.devices.create({
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
              helperText={typeof errors['deviceFields'] === "string" && errors['deviceFields']}>
              <FieldArray
                name={'deviceFields'}
                render={arr => values['deviceFields'].map((v, i) => {
                  const error = _get(errors["deviceFields"], `[${i}].name`);
                  return (
                    <FormGroup
                      key={i}
                      intent="danger"
                      helperText={error}
                      style={{ marginBottom: i !== values['deviceFields'].length - 1 ? 12 : 0 }}
                    >
                      <div className="flex">
                        <ControlGroup fill className="flex-grow">
                          <InputGroup
                            name={`deviceFields[${i}].name`}
                            type="text" value={v.name}
                            intent={!!error ? "danger" : "none"}
                            readOnly={values['deviceFields'][i].required}
                            onChange={e => {
                              setFieldValue(`deviceFields[${i}].name`, '');
                              handleChange(e);
                              if (i === values['deviceFields'].length - 1) arr.push({ name: '', type: 'string' })
                            }}
                            placeholder={i === values['deviceFields'].length - 1 ? "Enter a new field name" : null} />
                          {i < values["deviceFields"].length - 1 &&
                            <HTMLSelect
                              name={`deviceFields[${i}].type`}
                              disabled={values['deviceFields'][i].required}
                              onChange={handleChange} value={v.type} options={fieldType} />}
                        </ControlGroup>
                        <Button minimal icon="trash" intent={(i === values['deviceFields'].length - 1) || values['deviceFields'][i].required ? null : "danger"}
                          onClick={() => arr.remove(i)}
                          disabled={(i === values['deviceFields'].length - 1) || values['deviceFields'][i].required} />
                      </div>
                    </FormGroup>
                  )
                })} />
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