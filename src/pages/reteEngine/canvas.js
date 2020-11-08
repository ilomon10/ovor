import React, { useContext, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ContextMenu, Menu, MenuItem, ResizeSensor, Colors } from '@blueprintjs/core';

import ReteEngineContext from 'components/hocs/reteEngine';

const Components = ({ className, onCreated }) => {
  const rete = useContext(ReteEngineContext);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    let { editor, engine } = rete;
    if (!editor) editor = rete.createEditor(ref.current);
    onCreated(editor, engine);
    editor.on('contextmenu', ({ e, node }) => {
      e.preventDefault();
      e.stopPropagation();
      let menus = [{
        text: "Add",
        icon: "plus",
        onClick: () => console.log("add")
      }, {
        text: "Duplicate",
        icon: "duplicate",
        onClick: () => console.log("duplicate")
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
          <Menu.Divider title="Action" />
          {menus.map((n, i) => (<MenuItem key={i} icon="blank" {...n} />))}
        </Menu>
      )

      ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => { });
    });
  }, [ref, rete.editor, rete.components]);  // eslint-disable-line react-hooks/exhaustive-deps
  const onResize = useCallback(() => {
    const { editor } = rete;
    editor.view.resize();
  }, [rete.editor]);  // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ResizeSensor onResize={onResize}>
      <div className={className}>
        <div ref={ref}></div>
      </div>
    </ResizeSensor>
  )
}

const Canvas = styled(Components)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .connection .main-path {
    stroke-width: 2px;
    stroke: ${Colors.GRAY1};
  }
  .connection .main-path:hover {
    stroke-width: 5px;
    stroke: ${Colors.RED3};
  }
`

export default Canvas;