import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, H1, Card, FormGroup, InputGroup, Button, Classes } from '@blueprintjs/core';
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
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
          <FormGroup
            label="Username"
            labelFor="f-username">
            <InputGroup name="username" id="f-username" type="text" />
          </FormGroup>
          <FormGroup
            label="Password"
            labelFor="f-password">
            <InputGroup name="password" id="f-password" type={isPasswordShow ? "text" : "password"} rightElement={lockButton} />
          </FormGroup>
          <Button text="Masuk" intent="primary" fill onClick={() => history.push('/')} />
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