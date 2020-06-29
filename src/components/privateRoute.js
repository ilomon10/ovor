import React, { useState, useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { FeathersContext } from './feathers';
import SpinnerWrapper from './spinnerWrapper';
import { Spinner } from '@blueprintjs/core';

export default props => {
  const [isAuth, setIsAuth] = useState(false);
  const history = useHistory();
  const feathers = useContext(FeathersContext);
  useEffect(()=>{
    feathers.doReAuthenticate().then(e => {
      setIsAuth(true);
    }).catch(e => {
      history.push('/login');
    })
  }, [feathers, history])
  const Loading = (
    <SpinnerWrapper>
      <Spinner size={100} />
    </SpinnerWrapper>
  )
  if (isAuth === false) return (
    <Route {...props} component={undefined}>
      {Loading}
    </Route>
  )
  return (<Route {...props} />)
}