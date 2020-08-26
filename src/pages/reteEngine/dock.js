import React, { useRef, useContext, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Menu, Icon } from '@blueprintjs/core';

import ReteEngineContext from 'components/hocs/reteEngine';

const Component = ({ className }) => {
  const rete = useContext(ReteEngineContext);
  const ref = useRef(null);
  useEffect(() => {
    const onCreateEditor = async () => {
      const { editor } = rete;
      editor.view.container.addEventListener('dragover', e => e.preventDefault())
      editor.view.container.addEventListener('drop', async (e) => {
        if (!e.dataTransfer) return;
        const name = e.dataTransfer.getData('componentName');
        const component = editor.components.get(name);

        if (!component) throw new Error(`Component ${name} not found`);

        editor.view.area.pointermove(e);
        const node = await component.createNode({});
        const point = editor.view.area.mouse
        node.position = [point.x, point.y];
        editor.addNode(node);
      })
    }
    if (rete.editor) {
      onCreateEditor();
    }

  }, [rete]);
  const onDragStart = useCallback((e, cname) => {
    e.dataTransfer.setData('componentName', cname)
  }, []);
  return (
    <div className={className} ref={ref}>
      <Menu>
        {rete.components.map((c, i) => (
          <Menu.Item text={c.name} key={i}
            draggable
            onDragStart={(e) => onDragStart(e, c.name)}
            labelElement={<Icon icon="drag-handle-vertical"
              style={{ cursor: "grab" }} />}
            icon={<Icon icon="dot" color={c.config.color} />} />
        ))}
      </Menu>
    </div>
  )
}

const Dock = styled(Component)`

`

export default Dock;