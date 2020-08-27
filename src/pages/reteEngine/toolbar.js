import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Button, ButtonGroup, Dialog, TextArea, Classes } from '@blueprintjs/core';
import AreaPlugin from 'rete-area-plugin';

import ReteEngineContext from 'components/hocs/reteEngine';
import { Box } from 'components/utility/grid';

const Toolbar = ({ onDeploy }) => {
  const rete = useContext(ReteEngineContext);
  const history = useHistory();
  const [version, setVersion] = useState('...');
  const [jsonDialog, setJsonDialog] = useState({
    isOpen: false,
    data: ''
  });
  useEffect(() => {
    const { editor } = rete;
    if (!editor) return;
    setVersion(editor.id);
  }, [rete.editor]) // eslint-disable-line react-hooks/exhaustive-deps
  const fitContent = useCallback(() => {
    const onCreateEditor = () => {
      const editor = rete.editor;
      AreaPlugin.zoomAt(editor, editor.nodes);
    }
    if (rete.editor) onCreateEditor();
  }, [rete.editor]);

  const downloadJSON = useCallback(() => {
    const onCreateEditor = () => {
      const editor = rete.editor;
      setJsonDialog(s => ({
        isOpen: true,
        data: JSON.stringify(editor.toJSON())
      }))
    }
    if (rete.editor) onCreateEditor();
  }, [rete.editor]);

  const onDeployClick = useCallback(() => {
    const { editor } = rete;
    onDeploy(editor.toJSON());
  }, [rete.editor, onDeploy]);  // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box>
      <Navbar>
        <Navbar.Group>
          <Button icon="chevron-left" onClick={() => { history.goBack() }} />
          <Navbar.Divider />
          <Navbar.Heading>{version}</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align="right">
          <ButtonGroup minimal>
            <Button icon="plus" />
            <Button icon="zoom-to-fit"
              onClick={fitContent} />
            <Button icon="fullscreen" />
            <Button icon="refresh" />
          </ButtonGroup>
          <Navbar.Divider />
          <ButtonGroup>
            <Button text="Json" icon="code" onClick={downloadJSON} />
            <Button text="Deploy" icon="upload" onClick={onDeployClick} />
          </ButtonGroup>
          <Dialog isOpen={jsonDialog.isOpen} onClose={() => setJsonDialog(a => ({ ...a, isOpen: false }))}>
            <div className={Classes.DIALOG_HEADER}>
              <h4 className={Classes.HEADING}>Generated JSON Schema</h4>
              <Button icon="cross" className={Classes.DIALOG_CLOSE_BUTTON} minimal
                onClick={() => setJsonDialog(a => ({ ...a, isOpen: false }))} />
            </div>
            <div className={Classes.DIALOG_BODY}>
              <TextArea growVertically fill value={jsonDialog.data} />
            </div>
          </Dialog>
        </Navbar.Group>
      </Navbar>
    </Box>
  )
}

export default Toolbar;