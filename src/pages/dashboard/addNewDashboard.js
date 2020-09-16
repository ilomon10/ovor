import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Classes, Button, FormGroup, InputGroup, RadioGroup, Radio, HTMLSelect } from '@blueprintjs/core';
import { FeathersContext } from 'components/feathers';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  'dashboard-title': Yup.string()
    .when('choice', {
      is: "1",
      then: Yup.string()
        .min(3, "Too Short!")
        .max(36, "Too Long!")
        .required("Please fill this field")
    })
})

const AddNewDashboard = ({ onClose }) => {
  const feathers = useContext(FeathersContext);
  const [templates, setTemplates] = useState([]);
  const createDashboard = useCallback((v, { setSubmitting }) => {
    const send = async () => {
      let payload = { title: v['dashboard-title'] };
      try {
        await feathers.dashboards.create({
          ...payload
        })
        onClose();
      } catch (e) {
        setSubmitting(false);
      }
    }
    send();
    // onClose();
  }, [onClose, feathers]);
  const cancel = useCallback(() => {
    onClose();
  }, [onClose]);
  useEffect(() => {
    feathers.dashboards.find().then(e => {
      setTemplates([...e.data])
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Formik
        initialValues={{
          'choice': "1",
          'dashboard-exist': "",
          'dashboard-title': ""
        }}
        validationSchema={Schema}
        onSubmit={createDashboard}>
        {({ values, errors, handleSubmit, handleChange, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <RadioGroup onChange={handleChange}
                name="choice"
                selectedValue={values['choice']}>
                <Radio label="Copy from existing" value="0" disabled />
                <FormGroup
                  disabled={values['choice'] !== "0"}
                  labelFor="dashboard-exist">
                  <HTMLSelect fill id="dashboard-exist"
                    value={values['template']}
                    onChange={handleChange}
                    disabled={values['choice'] !== "0"}
                    name="dashboard-exist" options={templates.map(e => (e.title))} />
                </FormGroup>
                <Radio label="Create new" value="1" />
                <FormGroup
                  disabled={values['choice'] !== "1"}
                  labelFor="dashboard-title"
                  intent={errors['dashboard-title'] ? 'danger' : 'none'}
                  helperText={errors['dashboard-title']}>
                  <InputGroup id="dashboard-title"
                    disabled={values['choice'] !== "1"}
                    defaultValue=""
                    value={values['new']}
                    onChange={handleChange}
                    intent={errors['dashboard-title'] ? 'danger' : 'none'}
                    name="dashboard-title" type="text"
                    placeholder="Enter a new dashboard Title" />
                </FormGroup>
              </RadioGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button minimal
                  onClick={cancel}
                  text="Close" intent="danger" />
                <Button text="Create"
                  type="submit"
                  loading={isSubmitting}
                  intent="primary" />
              </div>
            </div>
          </form>)}
      </Formik>
    </>
  )
}

export default AddNewDashboard;