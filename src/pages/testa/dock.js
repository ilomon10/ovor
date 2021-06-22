import React, { useEffect, useMemo, useCallback } from "react";
import { Menu, Icon } from "@blueprintjs/core";
import { Node, Editor } from "fungsi-maju";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import Draggable from "components/draggable";

const Dock = () => {
  const { editor, components } = useFungsiMaju();
  const componentList = useMemo(() => {
    console.log(components);
    return components.map(({ name }) => ({
      name
    }));
  }, [components]);

  useEffect(() => {
    if (!editor) return;
    console.log(editor);
    const handlers = [
      (e) => {
        e.preventDefault();
      },
      async (e) => {
        e.preventDefault();
        if (!e.dataTransfer) return;
        const name = e.dataTransfer.getData("componentName");
        const component = editor.components[name];
        if (!component) throw new Error(`Component ${name} not found`);
        console.log(name, component);
        editor.view.area.pointermove(e);
        const node = new Node(Editor.generateId(), name);
        const point = editor.view.area.mouse;
        node.position = [point.x, point.y];
        editor.addNode(node);
      }
    ]
    editor.view.container.addEventListener("dragover", handlers[0]);
    editor.view.container.addEventListener("drop", handlers[1]);
    return () => {
      editor.view.container.removeEventListener("dragover", handlers[0]);
      editor.view.container.removeEventListener("drop", handlers[1]);
    }
  }, [editor])

  const onDragStart = useCallback((e, cname) => {
    console.log("setdata", cname);
    e.dataTransfer.setData("componentName", cname)
  }, []);
  return (
    <Menu>
      {componentList.map(({ name }, idx) => (
        <Draggable key={idx}>
          {({
            isDrag,
            onDragEndHandler,
            onMouseDownHandler,
            onMouseUpHandler
          }) => (
            <Menu.Item
              text={name}
              draggable={isDrag}
              onDragStart={(e) => onDragStart(e, name)}
              onDragEnd={onDragEndHandler}
              style={{ cursor: "grab" }}
              onMouseDown={onMouseDownHandler}
              onMouseUp={onMouseUpHandler}
              labelElement={<Icon icon="drag-handle-vertical" />}
              icon={<Icon icon="symbol-square" color={"red"} />}
            />
          )}
        </Draggable>
      ))}
    </Menu>
  )
}

export default Dock;