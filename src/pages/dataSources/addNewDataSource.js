import React, { useState, useCallback, useContext } from 'react';
import { Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect, Button, Callout } from '@blueprintjs/core';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FeathersContext } from 'components/feathers';
import _get from "lodash.get";

const Schema = Yup.object().shape({
  dataSourceName: Yup.string()
    .min(3, "Too Short!")
    .max(24, "Too Long!")
    .required('Fill this field'),
  dataSouceFields: Yup.array()
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

const AddDataSource = ({ onClose }) => {
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
          'dataSourceName': '',
          'dataSourceFields': [
            { name: 'timestamp', type: 'date', required: true },
            { name: '', type: 'number' }
          ]
        }}
        validationSchema={Schema}
        onSubmit={async (v, { setSubmitting, setErrors }) => {
          const fields = [...v['dataSourceFields']]
            .map(({ name, type }) => ({
              name, type
            }));
          fields.pop();
          try {
            await feathers.dataSources.create({
              name: v['dataSourceName'], fields
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
              label="Ember Name"
              labelFor="dataSourceName"
              intent={errors['dataSourceName'] ? 'danger' : 'none'}
              helperText={errors['dataSourceName']}>
              <InputGroup id="dataSourceName" name="dataSourceName" type="text"
                intent={errors['dataSourceName'] ? 'danger' : 'none'}
                value={values['dataSourceName']}
                onChange={handleChange} />
            </FormGroup>
            <FormGroup
              label="Fields"
              labelInfo={`(${values['dataSourceFields'].length - 1})`}
              intent={errors['dataSourceFields'] ? 'danger' : 'none'}
              helperText={typeof errors['dataSourceFields'] === "string" && errors['dataSourceFields']}>
              <FieldArray
                name={'dataSourceFields'}
                render={arr => values['dataSourceFields'].map((v, i) => {
                  const error = _get(errors["dataSourceFields"], `[${i}].name`);
                  return (
                    <FormGroup
                      key={i}
                      intent="danger"
                      helperText={error}
                      style={{ marginBottom: i !== values['dataSourceFields'].length - 1 ? 12 : 0 }}
                    >
                      <div className="flex">
                        <ControlGroup fill className="flex-grow">
                          <InputGroup
                            name={`dataSourceFields[${i}].name`}
                            type="text" value={v.name}
                            intent={!!error ? "danger" : "none"}
                            readOnly={values['dataSourceFields'][i].required}
                            onChange={e => {
                              setFieldValue(`dataSourceFields[${i}].name`, '');
                              handleChange(e);
                              if (i === values['dataSourceFields'].length - 1) arr.push({ name: '', type: 'string' })
                            }}
                            placeholder={i === values['dataSourceFields'].length - 1 ? "Enter a new field name" : null} />
                          {i < values["dataSourceFields"].length - 1 &&
                            <HTMLSelect
                              name={`dataSourceFields[${i}].type`}
                              disabled={values['dataSourceFields'][i].required}
                              onChange={handleChange} value={v.type} options={fieldType} />}
                        </ControlGroup>
                        <Button minimal icon="trash" intent={(i === values['dataSourceFields'].length - 1) || values['dataSourceFields'][i].required ? null : "danger"}
                          onClick={() => arr.remove(i)}
                          disabled={(i === values['dataSourceFields'].length - 1) || values['dataSourceFields'][i].required} />
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

export default AddDataSource;