import React from 'react';
import styled from 'styled-components';
import Canvas from './canvas';

const Component = ({ className }) => {
  return (
    <div className={className}>
      <Canvas />
    </div>
  )
}

const ReteEngine = styled(Component)`
  height: 100%;
`

export default ReteEngine;