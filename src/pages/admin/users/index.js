import React, { useCallback, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Colors,
  H2,
  H3,
  Navbar,
  Classes,
  FormGroup,
  InputGroup,
  Dialog,
  AnchorButton,
  Callout,
} from "@blueprintjs/core";

import { Flex, Box } from "components/utility/grid";
import { container } from "components/utility/constants";
import { FeathersContext } from "components/feathers";
import Checkbox from "components/formikCheckbox";

import DeleteUser from "./deleteUser";
import Wrapper from "components/wrapper";
import { toaster } from "components/toaster";

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required"),
  permissions: Yup.array().of(Yup.string().oneOf(["admin", "public"])),
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  "confirm-password": Yup.string()
    .oneOf([Yup.ref("password"), null], "Password must match")
    .required("Confirm your password"),
});

const Users = () => {
  const history = useHistory();
  const params = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState({
    delete: false,
  });
  const feathers = useContext(FeathersContext);
  const [user, setUser] = useState({
    _id: "",
    name: "",
    username: "",
    email: "",
    permissions: [],
  });
  useEffect(() => {
    const fetch = async () => {
      const { _id, name, username, email, permissions } =
        await feathers.users.get(params.id);
      setUser({ _id, name, username, email, permissions });
    };
    fetch();
  }, [params.id, feathers.users]);
  const updateUser = useCallback(
    async (
      { name, username, email, permissions },
      { setErrors, setSubmitting }
    ) => {
      try {
        await feathers.users.patch(params.id, {
          name,
          username,
          email,
          permissions,
        });
        toaster.show({
          message: "User information updated.",
          intent: "success",
        });
      } catch (e) {
        console.error(e);
        setErrors({ submit: e.message });
        toaster.show({ message: e.message, intent: "danger" });
      }
      setSubmitting(false);
    },
    [params.id, feathers.users]
  );
  const updatePassword = useCallback(
    async ({ password }, { setErrors, setSubmitting }) => {
      try {
        await feathers.users.patch(params.id, { password });
        toaster.show({ message: "User password updated.", intent: "success" });
      } catch (e) {
        console.error(e);
        setErrors({ submit: e.message });
        toaster.show({ message: e.message, intent: "danger" });
      }
      setSubmitting(false);
    },
    [params.id, feathers.users]
  );
  return (
    <>
      <Helmet>
        <title>{user.name} User | Ovor</title>
        <meta name="description" content="User manager" />
      </Helmet>
      <Flex
        backgroundColor={Colors.LIGHT_GRAY5}
        flexDirection="column"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Navbar style={{ padding: 0 }}>
          <Box mx="auto" px={3} maxWidth={[container.sm]}>
            <Navbar.Group align="left">
              <Link
                to="/users"
                title="Go Back"
                icon="chevron-left"
                component={React.forwardRef(({ navigate, ...props }, ref) => (
                  <AnchorButton ref={ref} {...props} />
                ))}
              />
              <Navbar.Divider />
              <h4
                className={`${Classes.HEADING} flex flex--i-center`}
                style={{ margin: 0 }}
              >
                {params.id}
              </h4>
            </Navbar.Group>
          </Box>
        </Navbar>
        <Box flexGrow={1} style={{ position: "relative" }}>
          <Wrapper style={{ overflowY: "auto" }}>
            <Box maxWidth={[container.sm]} mx="auto" px={3}>
              <Box pt={3}>
                <H2>Edit User Profile</H2>
              </Box>
              <Box mb={3}>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: user["name"] || "",
                    username: user["username"] || "",
                    email: user["email"] || "",
                    permissions: user["permissions"] || "",
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={updateUser}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    isSubmitting,
                    touched,
                    handleBlur,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      {errors.submit && (
                        <Callout intent="danger" style={{ marginBottom: 15 }}>
                          {errors.submit}
                        </Callout>
                      )}
                      <FormGroup label="Name" labelFor="f-name">
                        <InputGroup
                          name="name"
                          id="f-name"
                          type="text"
                          value={values["name"]}
                          onChange={(e) => {
                            handleChange(e);
                            handleBlur(e);
                          }}
                        />
                      </FormGroup>
                      <FormGroup label="Username" labelFor="f-username">
                        <InputGroup
                          name="username"
                          id="f-username"
                          type="text"
                          value={values["username"]}
                          onChange={(e) => {
                            handleChange(e);
                            handleBlur(e);
                          }}
                        />
                      </FormGroup>
                      <FormGroup label="Email" labelFor="f-email">
                        <InputGroup
                          name="email"
                          id="f-email"
                          type="text"
                          value={values["email"]}
                          onChange={(e) => {
                            handleChange(e);
                            handleBlur(e);
                          }}
                        />
                      </FormGroup>
                      <FormGroup label="Permissions" labelFor="f-permissions">
                        <Checkbox
                          large
                          inline
                          label="Public"
                          name="permissions"
                          value="public"
                          onChange={handleBlur}
                        />
                        <Checkbox
                          large
                          inline
                          label="Admin"
                          name="permissions"
                          value="admin"
                          onChange={handleBlur}
                        />
                      </FormGroup>
                      <Button
                        text="Update profile"
                        type="submit"
                        disabled={Object.keys(touched).length === 0}
                        loading={isSubmitting}
                      />
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
                    password: "",
                    "confirm-password": "",
                  }}
                  validationSchema={PasswordSchema}
                  onSubmit={updatePassword}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    isSubmitting,
                    touched,
                    handleBlur,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      {errors.submit && (
                        <Callout intent="danger" style={{ marginBottom: 15 }}>
                          {errors.submit}
                        </Callout>
                      )}
                      <FormGroup
                        label="New Password"
                        labelFor="f-password"
                        intent={errors["password"] ? "danger" : "none"}
                        helperText={errors["password"]}
                      >
                        <InputGroup
                          name="password"
                          id="f-password"
                          type="password"
                          intent={errors["password"] ? "danger" : "none"}
                          value={values["password"]}
                          onChange={(e) => {
                            handleChange(e);
                            handleBlur(e);
                          }}
                        />
                      </FormGroup>
                      <FormGroup
                        label="Confirm Password"
                        labelFor="f-confirm-password"
                        intent={errors["confirm-password"] ? "danger" : "none"}
                        helperText={errors["confirm-password"]}
                      >
                        <InputGroup
                          name="confirm-password"
                          id="f-confirm-password"
                          type="password"
                          value={values["confirm-password"]}
                          intent={
                            errors["confirm-password"] ? "danger" : "none"
                          }
                          onChange={(e) => {
                            handleChange(e);
                            handleBlur(e);
                          }}
                        />
                      </FormGroup>
                      <Button
                        text="Update password"
                        type="submit"
                        disabled={Object.keys(touched).length === 0}
                        loading={isSubmitting}
                      />
                    </form>
                  )}
                </Formik>
              </Box>
              <Flex alignItems="center" pb={3}>
                <Box flexGrow={1} pt={3}>
                  <h4 className={Classes.HEADING}>Delete this user</h4>
                  <p>
                    Once you delete a user, there is no going back. Please be
                    certain
                  </p>
                </Box>
                <Box flexShrink={0}>
                  <Button
                    text="Delete this user"
                    intent="danger"
                    onClick={() => setIsDialogOpen((s) => ({ delete: true }))}
                  />
                </Box>
              </Flex>
              <Dialog
                usePortal={true}
                title="Delete account"
                isOpen={isDialogOpen["delete"]}
                onClose={() => {
                  setIsDialogOpen((s) => ({ delete: false }));
                }}
              >
                <DeleteUser
                  data={user}
                  onClose={() => {
                    setIsDialogOpen((s) => ({ delete: false }));
                  }}
                  onDeleted={() => history.goBack()}
                />
              </Dialog>
            </Box>
          </Wrapper>
        </Box>
      </Flex>
    </>
  );
};

export default Users;
