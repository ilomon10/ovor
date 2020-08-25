import React from 'react';
import styled from 'styled-components';
import Canvas from './canvas';
import { ReteEngineProvider } from 'components/hocs/reteEngine';

const Component = ({ className }) => {
  return (
    <div className={className}>
      <ReteEngineProvider>
        <Canvas />
      </ReteEngineProvider>
    </div>
  )
}

const ReteEngine = styled(Component)`
  height: 100%;
`

export default ReteEngine;