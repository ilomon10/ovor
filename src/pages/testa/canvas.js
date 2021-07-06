import "fungsi-maju/build/index.css";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import { ContextMenu, Menu, MenuItem, MenuDivider, Dialog } from "@blueprintjs/core";
import ConfigNode from "./configNode";
import { useFeathers } from "components/feathers";
import { useParams } from "react-router-dom";

const Canvas = ({ onCreated = () => { } }) => {
  const params = useParams();
  const feathers = useFeathers();
  let { createEditor, editor } = useFungsiMaju();
  let [selectedNode, setSelectedNode] = useState(null);
  let [isDialogOpen, setIsDialogOpen] = useState(null);
  const ref = useRef(null);

  const onConfigSaved = useCallback(() => {
    if(editor === null) return;
    const json = editor.toJSON(true);
    console.log(json.nodes);
    editor.fromJSON(json);
  }, [editor]);

  useEffect(() => {
    if (!ref.current) return;
    if (!editor) {
      let ed = createEditor(ref.current);
      if (!ed) return;
      onCreated(ed);
      return;
    }
    async function fetch() {
      const { id } = params;
      let saraf = null;
      try {
        saraf = await feathers.testa.get(id, {
          query: {
            $select: ["_id", "nodes", "version", "name"]
          }
        });
      } catch (err) {
        console.error(err);
      }
      if (!saraf) return;
      console.log(saraf);
      let { version, nodes } = saraf;
      editor.fromJSON({ version, nodes })
    }
    fetch();

  }, [ref, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on("contextmenu", ({ e, node }) => {
      e.preventDefault();
      e.stopPropagation();

      let menuList = [];
      let items = [];

      if (node) {
        items = [{
          text: "Configure",
          icon: "cog",
          onClick: async () => {
            await setSelectedNode(node);
            await setIsDialogOpen("node");
          }
        }, {
          text: "Duplicate",
          icon: "duplicate",
          onClick: () => console.log("duplicate")
        }, {
          text: "Delete",
          icon: "trash",
          intent: "danger",
          onClick: () => {
            console.log("delete");
            editor.removeNode(node);
          }
        }]
      } else {
        items = [{
          text: "Add",
          icon: "plus",
          onClick: () => console.log("add")
        }]
      }

      items.forEach((item) => menuList.push(item));

      const menu = (
        <Menu>
          <MenuDivider title="Action" />
          {menuList.map((n, i) => (<MenuItem key={i} icon="blank" {...n} />))}
        </Menu>
      )

      ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => { });

    })
  }, [editor])

  return (
    <>
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
      <Dialog
        isOpen={isDialogOpen === "node"}
        title="Node Configuration"
        onClose={() => {
          setIsDialogOpen(null);
          setSelectedNode(null);
        }}
      >
        <ConfigNode
          node={selectedNode}
          onClose={() => {
            setIsDialogOpen(null);
            setSelectedNode(null);
          }}
          onSubmit={() => {
            onConfigSaved();
            setIsDialogOpen(null);
            setSelectedNode(null);
          }}
        />
      </Dialog>
    </>
  )
}

export default Canvas;