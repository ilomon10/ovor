import React from 'react';
import { Colors, NonIdealState } from '@blueprintjs/core';
import { Helmet } from 'react-helmet';
import { Box } from 'components/utility/grid';

const FourOFour = () => {
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