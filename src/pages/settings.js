import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

const Settings = () => {
  return (
    <NonIdealState
      icon="code-block"
      title="Sorry guys"
      description={(<>
        <span>This page is under maintenance.</span>
        <br />
        <span>Please come back again soon.</span>
      </>)} />
  )
}

export default Settings;