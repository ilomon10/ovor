import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, H1, Card, FormGroup, InputGroup, Button, Classes } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  fullName: Yup.string().required('Fill with your name'),
  email: Yup.string().required('Fill with your email'),
  password: Yup.string().required('Password is required'),
  passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match').required('Fill with previous password')
})

const Register = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const lockButton = (<Button minimal icon={isPasswordShow ? "eye-open" : "eye-off"} onClick={() => setIsPasswordShow(!isPasswordShow)} />)
  return (
    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: Colors.LIGHT_GRAY5 }}>
      <div style={{ width: 340, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 12 }}>
          <FontAwesomeIcon style={{ color: Colors.DARK_GRAY4 }} icon={['ovor', 'logo']} size="4x" />
        </div>
        <H1 style={{ textAlign: "center", fontSize: 22, fontWeight: 'lighter', marginBottom: 15 }}>Masuk ke Ovord</H1>
        <Card style={{ marginBottom: 24 }}>
          <Formik
            initialValues={{
              'fullName': '',
              'email': '',
              'password': '',
              'passwordConfirm': ''
            }}
            validationSchema={Schema}
            onSubmit={(v) => console.log(v)}>
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <FormGroup
                  label="Full Name"
                  labelFor="f-fullName"
                  intent={errors['fullName'] ? "danger" : "none"}
                  helperText={errors['fullName']}>
                  <InputGroup name="fullName" id="f-fullName" type="text"
                    value={values['fullName']}
                    intent={errors["fullName"] ? "danger" : "none"}
                    onChange={handleChange} />
                </FormGroup>
                <FormGroup
                  label="Email"
                  labelFor="f-email"
                  intent={errors.email ? "danger" : "none"}
                  helperText={errors.email}>
                  <InputGroup name="email" id="f-email" type="text"
                    value={values['email']}
                    intent={errors.email ? "danger" : "none"}
                    onChange={handleChange} />
                </FormGroup>
                <FormGroup
                  label="Password"
                  labelFor="f-password"
                  intent={errors.password ? "danger" : "none"}
                  helperText={errors.password}>
                  <InputGroup name="password" id="f-password" type={isPasswordShow ? "text" : "password"} rightElement={lockButton}
                    value={values['password']}
                    intent={errors.password ? "danger" : "none"}
                    onChange={handleChange} />
                </FormGroup>
                <FormGroup
                  label="Confirm Password"
                  labelFor="f-passwordConfirm"
                  intent={errors.passwordConfirm ? "danger" : "none"}
                  helperText={errors.passwordConfirm}>
                  <InputGroup name="passwordConfirm" id="f-passwordConfirm" type={isPasswordShow ? "text" : "password"}
                    value={values['passwordConfirm']}
                    intent={errors['passwordConfirm'] ? "danger" : "none"}
                    onChange={handleChange} />
                </FormGroup>
                <Button type="submit" text="Register" intent="primary"
                  loading={isSubmitting} fill
                  disabled={Object.entries(errors).length > 0} />
              </form>)}
          </Formik>
        </Card>
        <Card style={{ backgroundColor: 'transparent', textAlign: 'center', marginBottom: 32 }}>
          <span>Sudah punya akun? </span>
          <Link to="/login">
            Masuk.
          </Link>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" className={Classes.TEXT_SMALL}>Lapor Sesuatu</Link>
        </div>
      </div>
    </div>
  )
}

export default Register;