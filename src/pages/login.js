import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, H1, Card, FormGroup, InputGroup, Button, Classes, Callout } from '@blueprintjs/core';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { FeathersContext } from 'components/feathers';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string().required('Fill with your email'),
  password: Yup.string().required('Fill with your password')
})

const Login = () => {
  const history = useHistory();
  const feathers = useContext(FeathersContext);
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
              'email': '',
              'password': ''
            }}
            validationSchema={Schema}
            onSubmit={async (v, { setSubmitting, setErrors }) => {
              try {
                await feathers.doAuthenticate({
                  strategy: 'local',
                  email: v.email,
                  password: v.password
                });
                history.push('/');
              } catch (e) {
                setErrors({ submit: e.message });
                setSubmitting(false);
              }
            }}>
            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                {errors.submit &&
                  <Callout intent="danger" style={{ marginBottom: 15 }}>
                    {errors.submit}
                  </Callout>}
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
                <Button type="submit" text="Masuk" intent="primary"
                  loading={isSubmitting} fill
                  disabled={Object.entries(errors).length > 0 && !errors.submit} />
              </form>)}
          </Formik>
        </Card>
        <Card style={{ backgroundColor: 'transparent', textAlign: 'center', marginBottom: 32 }}>
          <span>Memulai akun baru? </span>
          <Link to="/register">
            Di sini.
          </Link>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" className={Classes.TEXT_SMALL}>Lapor Sesuatu</Link>
        </div>
      </div>
    </div>
  )
}

export default Login;