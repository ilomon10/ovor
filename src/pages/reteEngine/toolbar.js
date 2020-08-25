import React, { useContext, useCallback } from 'react';
import { Box } from 'components/utility/grid';
import { Navbar, Button } from '@blueprintjs/core';
import ReteEngineContext from 'components/hocs/reteEngine';
import AreaPlugin from 'rete-area-plugin';

const Toolbar = () => {
  const rete = useContext(ReteEngineContext);
  const fitContent = useCallback(() => {
    const onCreateEditor = () => {
      const editor = rete.editor;
      AreaPlugin.zoomAt(editor, editor.nodes);
    }
    if (rete.editor) onCreateEditor();
  }, [rete.editor])
  return (
    <Box>
      <Navbar>
        <Navbar.Group>
          <Button text="Add" icon="plus" />
          <Navbar.Divider />
          <Button text="Fit Content" icon="zoom-to-fit"
            onClick={fitContent} />
        </Navbar.Group>
        <Navbar.Group align="right">
          <Button text="Deploy" icon="upload" />
        </Navbar.Group>
      </Navbar>
    </Box>
  )
}

export default Toolbar;