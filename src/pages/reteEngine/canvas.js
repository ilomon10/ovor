import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import AreaPlugin from "rete-area-plugin";

import ReteEngineContext from 'components/hocs/reteEngine';

import DefaultNode from "components/rete/default.json";

const Components = ({ className }) => {
  const rete = useContext(ReteEngineContext);
  const ref = useRef(null);
  useEffect(() => {
    if (ref) rete.createEditor(ref.current);
    const onCreateEditor = async () => {
      const editor = rete.editor;
      
      await editor.fromJSON(DefaultNode);

      AreaPlugin.zoomAt(editor, editor.nodes);

      console.log(editor.toJSON());

    }
    if (rete.editor) {
      onCreateEditor();
    }
  }, [ref, rete]);
  return (
    <div className={className}>
      <div ref={ref}></div>
    </div>
  )
}

const Canvas = styled(Components)`
  height: 100%;
`

export default Canvas;