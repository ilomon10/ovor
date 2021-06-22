import "fungsi-maju/build/index.css";
import React, { useRef, useEffect } from "react";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import { ResizeSensor } from "@blueprintjs/core";

const Canvas = ({ onCreated = () => { } }) => {
  let { createEditor, components, editor } = useFungsiMaju();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!editor) {
      let ed = createEditor(ref.current);
      if (!ed) return;
      onCreated(ed);
      return;
    }
    editor.on("contextmenu", ({ e, node }) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("klik kanan", node);
    })
    console.log(editor);
  }, [ref, editor, components]);

  return (
    <ResizeSensor>
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
    </ResizeSensor>
  )
}

export default Canvas;