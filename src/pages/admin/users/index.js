import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Colors, H2, H3, Navbar, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { Box } from "components/utility/grid";
import { container } from 'components/utility/constants';
import { useHistory, useParams } from 'react-router-dom';
import { FeathersContext } from 'components/feathers';
import Checkbox from 'components/formikCheckbox';

const ProfileSchema = Yup.object().shape({
  'name': Yup.string()
    .required("Name is required"),
  'email': Yup.string()
    .required("Email is required"),
  'permissions': Yup.array().of(Yup.string().oneOf(['admin', 'public']))
});

const PasswordSchema = Yup.object().shape({
  'password': Yup.string()
    .required("Password is required"),
  'confirm-password': Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password must match')
    .required('Confirm your password'),
});

const Users = () => {
  const history = useHistory();
  const params = useParams();
  const feathers = useContext(FeathersContext);
  const [user, setUser] = useState({
    name: '',
    email: '',
    permissions: []
  });
  useEffect(() => {
    const fetch = async () => {
      const { name, email, permissions } = await feathers.users.get(params.id);
      setUser({ name, email, permissions });
    }
    fetch();
  }, [params.id]);
  const updateUser = useCallback(async ({ name, email, permissions }, { setErrors, setSubmitting }) => {
    try {
      await feathers.users.patch(params.id, {
        name, email, permissions
      });
    } catch (e) {
      console.error(e);
      setErrors({ submit: e.message });
    }
    setSubmitting(false);
  }, []);
  const updatePassword = useCallback(async ({ password }, { setErrors, setSubmitting }) => {
    try {
      await feathers.users.patch(params.id, { password });
    } catch (e) {
      console.error(e);
      setErrors({ submit: e.message });
    }
    setSubmitting(false);
  }, []);
  return (<>
    <Helmet>
      <title>{} User | Ovor</title>
      <meta name="description" content="User manager" />
    </Helmet>
    <Box backgroundColor={Colors.LIGHT_GRAY5} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Navbar style={{ padding: 0 }}>
        <Box mx="auto" px={3}
          maxWidth={[container.sm]}>
          <Navbar.Group align="left">
            <Button icon="chevron-left" onClick={() => { history.goBack() }} />
            <Navbar.Divider />
            <h4 className={`${Classes.HEADING} flex flex--i-center`}
              style={{ margin: 0 }}>{params.id}</h4>
          </Navbar.Group>
        </Box>
      </Navbar>
      <Box maxWidth={[container.sm]} mx="auto" px={3}>
        <Box pt={3}>
          <H2>Edit User Profile</H2>
        </Box>
        <Box mb={3}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              "name": user['name'] || '',
              "email": user['email'] || '',
              "permissions": user['permissions'] || ''
            }}
            validationSchema={ProfileSchema}
            onSubmit={updateUser}>
            {({ handleSubmit, handleChange, values, isSubmitting, touched, handleBlur }) => (
              <form onSubmit={handleSubmit}>
                <FormGroup label="Name"
                  labelFor="f-name">
                  <InputGroup name="name" id="f-name" type="text"
                    value={values['name']} onChange={(e) => {
                      handleChange(e);
                      handleBlur(e);
                    }} />
                </FormGroup>
                <FormGroup label="Email"
                  labelFor="f-email">
                  <InputGroup name="email" id="f-email" type="text"
                    value={values['email']}
                    onChange={(e) => {
                      handleChange(e);
                      handleBlur(e);
                    }} />
                </FormGroup>
                <FormGroup label="Permissions"
                  labelFor="f-permissions">
                  <Checkbox large inline label="Public" name="permissions" value="public" onChange={handleBlur} />
                  <Checkbox large inline label="Admin" name="permissions" value="admin" onChange={handleBlur} />
                </FormGroup>
                <Button text="Update profile" type="submit" disabled={Object.keys(touched).length === 0} loading={isSubmitting} />
              </form>
            )}
          </Formik>
        </Box>
        <Box pt={3}>
          <H3>Change Password</H3>
        </Box>
        <Box mb={3}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              'password': "",
              'confirm-password': "",
            }}
            validationSchema={PasswordSchema}
            onSubmit={updatePassword}>
            {({ handleSubmit, handleChange, values, errors, isSubmitting, touched, handleBlur }) => (
              <form onSubmit={handleSubmit}>
                <FormGroup label="New Password"
                  labelFor="f-password"
                  intent={errors['password'] ? 'danger' : 'none'}
                  helperText={errors['password']}>
                  <InputGroup name="password" id="f-password" type="password"
                    intent={errors['password'] ? 'danger' : 'none'}
                    value={values['password']} onChange={(e) => {
                      handleChange(e);
                      handleBlur(e);
                    }} />
                </FormGroup>
                <FormGroup label="Confirm Password"
                  labelFor="f-confirm-password"
                  intent={errors['confirm-password'] ? 'danger' : 'none'}
                  helperText={errors['confirm-password']}>
                  <InputGroup name="confirm-password" id="f-confirm-password" type="password"
                    value={values['confirm-password']}
                    intent={errors['confirm-password'] ? 'danger' : 'none'}
                    onChange={(e) => {
                      handleChange(e);
                      handleBlur(e);
                    }} />
                </FormGroup>
                <Button text="Update password" type="submit" disabled={Object.keys(touched).length === 0} loading={isSubmitting} />
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  </>)
}

export default Users;