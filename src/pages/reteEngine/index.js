import React, { useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { ReteEngineProvider } from 'components/hocs/reteEngine';
import { Box, Flex } from 'components/utility/grid';
import InputComponent from 'components/rete/nodes/input';
import OutputComponent from 'components/rete/nodes/output';
import OperationComponent from 'components/rete/nodes/operation';
import NumericComponent from 'components/rete/nodes/numeric';

import Canvas from './canvas';
import Toolbar from './toolbar';
import Dock from './dock';

const Component = ({ className }) => {
  const [components] = useState([
    new InputComponent({
      outputs: [{
        "key": "temp",
        "name": "temperature",
        "type": "number"
      }, {
        "key": "humi",
        "name": "humidity",
        "type": "number"
      },
      {
        "key": "time",
        "name": "timestamp",
        "type": "timestamp"
      }]
    }),
    new OutputComponent({
      inputs: [
        {
          "key": "temp",
          "name": "temperature",
          "type": "number"
        },
        {
          "key": "time",
          "name": "timestamp",
          "type": "timestamp"
        }
      ]
    }),
    new NumericComponent(),
    new OperationComponent()
  ]);
  return (
    <>
      <Helmet>
        <title>Rete Editor | Ovor</title>
        <meta name="description" content="Rete algorithm editor" />
      </Helmet>
      <ReteEngineProvider components={components}>
        <div className={className}>
          <Toolbar />
          <Flex height="100%" width="100%">
            <Box flexShrink={0}
              width="200px">
              <Dock />
            </Box>
            <Box flexGrow={1} >
              <Canvas />
            </Box>
          </Flex>
        </div>
      </ReteEngineProvider>
    </>
  )
}

const ReteEngine = styled(Component)`
  height: 100%;
`

export default ReteEngine;