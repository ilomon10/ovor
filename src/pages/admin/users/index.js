import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Colors, H2, Navbar, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { Box } from "components/utility/grid";
import { container } from 'components/utility/constants';
import { useHistory, useParams } from 'react-router-dom';
import { FeathersContext } from 'components/feathers';
import Checkbox from 'components/formikCheckbox';

const Schema = Yup.object().shape({
  'name': Yup.string()
    .required("Name is required"),
  'email': Yup.string()
    .required("Email is required"),
  'permissions': Yup.array().of(Yup.string().oneOf(['admin', 'public']))
})

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
      console.log({ name, email, permissions });
      await feathers.users.patch(params.id, {
        name, email, permissions
      });
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
          maxWidth={[container.lg]}>
          <Navbar.Group align="left">
            <Button icon="chevron-left" onClick={() => { history.goBack() }} />
            <Navbar.Divider />
            <h4 className={`${Classes.HEADING} flex flex--i-center`}
              style={{ margin: 0 }}>{params.id}</h4>
          </Navbar.Group>
        </Box>
      </Navbar>
      <Box maxWidth={[container.lg]} mx="auto" px={3}>
        <Box pt={3}>
          <H2>Edit User Profile</H2>
        </Box>
        <Formik
          enableReinitialize={true}
          initialValues={{
            "name": user['name'] || '',
            "email": user['email'] || '',
            "permissions": user['permissions'] || ''
          }}
          validationSchema={Schema}
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
                  value={values['email']} onChange={handleChange}
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
              <Button text="Update profile" intent="success" type="submit" disabled={Object.keys(touched).length === 0} loading={isSubmitting} />
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  </>)
}

export default Users;