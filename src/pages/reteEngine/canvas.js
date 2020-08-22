import React from 'react';
import styled from 'styled-components';
import { createEditor } from './rete';

const Components = ({ className }) => {
  return (
    <div className={className}>
      <div ref={ref => ref && createEditor(ref)}></div>
    </div>
  )
}

const Canvas = styled(Components)`
  height: 100%;
`

export default Canvas;