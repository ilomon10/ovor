import React, { useRef, useContext, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Menu, Icon, Colors } from '@blueprintjs/core';

import ReteEngineContext from 'components/hocs/reteEngine';
import Draggable from 'components/draggable';

const Component = ({ className }) => {
  const rete = useContext(ReteEngineContext);
  const ref = useRef(null);
  useEffect(() => {
    if (!rete.editor) return;
    const { editor } = rete;
    const handlers = [
      (e) => {
        e.preventDefault();
      },
      async (e) => {
        if (!e.dataTransfer) return;
        const name = e.dataTransfer.getData('componentName');
        const component = editor.components.get(name);

        if (!component) throw new Error(`Component ${name} not found`);

        editor.view.area.pointermove(e);
        const node = await component.createNode({});
        const point = editor.view.area.mouse;
        node.position = [point.x, point.y];
        editor.addNode(node);
      }];

    editor.view.container.addEventListener('dragover', handlers[0]);
    editor.view.container.addEventListener('drop', handlers[1]);

    return () => {
      editor.view.container.removeEventListener('dragover', handlers[0]);
      editor.view.container.removeEventListener('drop', handlers[1]);
    }
  }, [rete]);
  const onDragStart = useCallback((e, cname) => {
    e.dataTransfer.setData('componentName', cname)
  }, []);
  return (
    <div className={className} ref={ref}>
      <Menu>
        {rete.components.map((c, i) => (
          <Draggable key={i}>
            {({ isDrag, onDragEndHandler,
              onMouseDownHandler, onMouseUpHandler }) => (
                <Menu.Item text={c.name}
                  draggable={isDrag}
                  onDragStart={(e) => onDragStart(e, c.name)}
                  onDragEnd={onDragEndHandler}
                  style={{ cursor: "grab" }}
                  onMouseDown={onMouseDownHandler}
                  onMouseUp={onMouseUpHandler}
                  labelElement={<Icon icon="drag-handle-vertical" />}
                  icon={<Icon icon="symbol-square" color={c.config.color} />} />
              )}
          </Draggable>

        ))}
      </Menu>
    </div>
  )
}

const Dock = styled(Component)`
  height: 100%;
  border-right: 1px solid ${Colors.GRAY5};
`

export default Dock;