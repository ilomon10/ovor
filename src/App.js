import React from 'react';
import { CommonProvider } from 'components/hocs/common';
import PrivateRouter from 'PrivateRouter';

const App = () => {
  return (
    <CommonProvider>
      <PrivateRouter />
    </CommonProvider>
  );
}

export default App;
