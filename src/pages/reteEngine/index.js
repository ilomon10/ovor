import React from 'react';
import styled from 'styled-components';
import { ReteEngineProvider } from 'components/hocs/reteEngine';
import Canvas from './canvas';
import Toolbar from './toolbar';
import Dock from './dock';
import { Box, Flex } from 'components/utility/grid';

const Component = ({ className }) => {
  return (
    <ReteEngineProvider>
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
  )
}

const ReteEngine = styled(Component)`
  height: 100%;
`

export default ReteEngine;