import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, H1, Card, FormGroup, InputGroup, Button, Classes, Callout, NonIdealState } from '@blueprintjs/core';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { FeathersContext } from 'components/feathers';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import { Box } from 'components/utility/grid';

const FourOFour = () => {
  const history = useHistory();
  const feathers = useContext(FeathersContext);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const lockButton = (<Button minimal icon={isPasswordShow ? "eye-open" : "eye-off"} onClick={() => setIsPasswordShow(!isPasswordShow)} />)
  return (
    <>
      <Helmet>
        <title>404 | Ovor</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Box style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: Colors.LIGHT_GRAY5 }}>
        <NonIdealState
          icon="error"
          title="404"
          description={<>
            <p>Page not found</p>
          </>} />
      </Box>
    </>
  )
}

export default FourOFour;