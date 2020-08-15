import React, { useState, useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { FeathersContext } from './feathers';
import SpinnerWrapper from './spinnerWrapper';
import { Spinner } from '@blueprintjs/core';
import Landing from 'pages/landing';

export default props => {
  const [isAuth, setIsAuth] = useState(undefined);
  const history = useHistory();
  const feathers = useContext(FeathersContext);
  useEffect(() => {
    feathers.doReAuthenticate().then(e => {
      setIsAuth(true);
    }).catch(e => {
      setIsAuth(false);
    })
  }, [feathers, history])
  const Loading = (
    <SpinnerWrapper>
      <Spinner size={100} />
    </SpinnerWrapper>
  )
  if (isAuth === undefined) return (
    <Route {...props} component={undefined}>
      {Loading}
    </Route>
  )

  if (isAuth === false) return (<Route {...props} component={Landing} />)

  return (<Route {...props} />)
}