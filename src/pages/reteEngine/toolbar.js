import React, { useContext, useCallback } from 'react';
import { Box } from 'components/utility/grid';
import { Navbar, Button, ButtonGroup } from '@blueprintjs/core';
import ReteEngineContext from 'components/hocs/reteEngine';
import AreaPlugin from 'rete-area-plugin';
import { useHistory } from 'react-router-dom';

const Toolbar = () => {
  const rete = useContext(ReteEngineContext);
  const history = useHistory();
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
          <Button icon="chevron-left" onClick={() => { history.goBack() }} />
          <Navbar.Divider />
        </Navbar.Group>
        <Navbar.Group align="right">
          <ButtonGroup>
            <Button icon="plus" />
            <Button icon="zoom-to-fit"
              onClick={fitContent} />
            <Button icon="fullscreen" />
          </ButtonGroup>
          <Navbar.Divider />
          <Button text="Deploy" icon="upload" />
        </Navbar.Group>
      </Navbar>
    </Box>
  )
}

export default Toolbar;