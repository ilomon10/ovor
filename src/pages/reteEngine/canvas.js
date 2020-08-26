import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import AreaPlugin from "rete-area-plugin";
import { ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import ReteEngineContext from 'components/hocs/reteEngine';

import DefaultNode from "components/rete/default.json";

const Components = ({ className }) => {
  const rete = useContext(ReteEngineContext);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && !rete.editor)
      rete.createEditor(ref.current);

    const onCreateEditor = async () => {

      const editor = rete.editor;
      const engine = rete.engine;

      await editor.fromJSON(DefaultNode);

      editor.on('process connectioncreated connectionremoved', async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      })

      AreaPlugin.zoomAt(editor, editor.nodes);
    }
    if (rete.editor) {
      onCreateEditor();
      const { editor } = rete;
      editor.on('contextmenu', ({ e, node }) => {
        e.preventDefault();
        e.stopPropagation();
        let menus = [{
          text: "Add",
          icon: "plus",
          onClick: () => console.log("add")
        }];
        if (node) {
          let item = {
            text: "Delete",
            intent: "danger",
            icon: "trash",
            onClick: () => { editor.removeNode(node) }
          };
          if (['GroupInput', 'GroupOutput'].indexOf(node.name) !== -1) {
            item.disabled = true;
            if (editor.nodes.filter((v) => v.name === node.name).length > 1) {
              item.disabled = false;
            }
          }
          menus.push(item);
        }
        const menu = (
          <Menu>
            {menus.map((n, i) => (<MenuItem key={i} icon="blank" {...n} />))}
          </Menu>
        )

        ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {

        });
      });
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