import React, { useCallback, useContext } from 'react';
import * as Yup from 'yup';
import { Classes, Button, FormGroup, InputGroup, Callout } from '@blueprintjs/core';
import { Formik } from 'formik';
import { FeathersContext } from 'components/feathers';
import Checkbox from 'components/formikCheckbox';

const Schema = Yup.object().shape({
  'name': Yup.string()
    .required("Name is required"),
  'email': Yup.string()
    .required("Email is required"),
  'password': Yup.string()
    .required("Password is required"),
  'confirm-password': Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required('Confirm your password'),
  'permissions': Yup.array().of(Yup.string().oneOf(['admin', 'public']))
})

const AddNewUser = ({ onClose }) => {
  const feathers = useContext(FeathersContext);
  const createUser = useCallback(({ name, email, password, permissions }, { setErrors, setSubmitting }) => {
    const send = async () => {
      try {
        await feathers.users().create({
          name, email, password, permissions,
        });
        onClose();
      } catch (e) {
        console.error(e);
        setErrors({ submit: e.message });
        setSubmitting(false);
      }
    }
    send();
  }, [feathers]);  // eslint-disable-line react-hooks/exhaustive-deps
  const cancel = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <>
      <Formik
        initialValues={{
          'name': "",
          'email': "",
          'password': "",
          'confirm-password': "",
          'permissions': ['public']
        }}
        validationSchema={Schema}
        onSubmit={createUser}>
        {({ values, errors, handleSubmit, handleChange, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            {errors.submit &&
              <Callout intent="danger" style={{ marginBottom: 15 }}>
                {errors.submit}
              </Callout>}
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                label={"Name"}
                labelFor="f-name"
                intent={errors['name'] ? 'danger' : 'none'}
                helperText={errors['name']}>
                <InputGroup fill id="f-name"
                  value={values['name']} type="text"
                  intent={errors['name'] ? 'danger' : 'none'}
                  onChange={handleChange}
                  name="name" />
              </FormGroup>
              <FormGroup
                label={"Email"}
                labelFor="f-email"
                intent={errors['email'] ? 'danger' : 'none'}
                helperText={errors['email']}>
                <InputGroup id="f-email"
                  value={values['email']}
                  onChange={handleChange}
                  intent={errors['email'] ? 'danger' : 'none'}
                  name="email" type="text" />
              </FormGroup>
              <FormGroup
                label="Password"
                labelFor="f-password"
                intent={errors['password'] ? 'danger' : 'none'}
                helperText={errors['password']}>
                <InputGroup id="f-password"
                  value={values['password']}
                  onChange={handleChange}
                  intent={errors['password'] ? 'danger' : 'none'}
                  name="password" type="password" />
              </FormGroup>
              <FormGroup
                label="Confirm Password"
                labelFor="f-confirm-password"
                intent={errors['confirm-password'] ? 'danger' : 'none'}
                helperText={errors['confirm-password']}>
                <InputGroup id="f-confirm-password"
                  value={values['confirm-password']}
                  onChange={handleChange}
                  intent={errors['confirm-password'] ? 'danger' : 'none'}
                  name="confirm-password" type="password" />
              </FormGroup>
              <FormGroup label="Permissions"
                intent={errors['permissions'] ? 'danger' : 'none'}
                helperText={errors['permissions']}>
                <Checkbox large inline label="Public" name="permissions" value="public" />
                <Checkbox large inline label="Admin" name="permissions" value="admin" />
              </FormGroup>
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

export default AddNewUser;