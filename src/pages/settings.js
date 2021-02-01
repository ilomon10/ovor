import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { Helmet } from 'react-helmet';

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Setting is undermaintenace | Ovor</title>
        <meta name="description" content="Setting area of application" />
      </Helmet>
      <NonIdealState
        icon="code-block"
        title="Sorry guys"
        description={
          (<>
            <span>This page is under maintenance.</span>
            <br />
            <span>Please come back again soon.</span>
          </>)} />
    </>
  )
}

export default Settings;