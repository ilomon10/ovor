import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog } from "@blueprintjs/core";
import { useField } from "formik";
import MonacoCodeEditor from "@monaco-editor/react";
import { Box } from "components/utility/grid";

const CodeEditor = ({ name, value }) => {
  const field = useField({ name });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  return (
    <Box>
      <Button text="Edit Code" onClick={() => setIsEditorOpen((s) => !s)} />
      <Dialog isOpen={isEditorOpen} canEscapeKeyClose={false}>
        <CodeEditoModal
          defaultValue={value}
          onClose={() => {
            setIsEditorOpen(false);
          }}
          onSubmit={(value) => {
            field[2].setValue(value);
            setIsEditorOpen(false);
          }}
        />
      </Dialog>
    </Box>
  );
};

const CodeEditoModal = ({ defaultValue, onClose, onSubmit }) => {
  const [value, setValue] = useState(defaultValue || "<div></div>");
  useEffect(() => {
    let preventEsc = (event) => {
      if (event.keyCode === 27) {
        event.preventDefault();
        return false;
      }
    };
    document.addEventListener("keyup", preventEsc, false);
    document.addEventListener("keydown", preventEsc, false);
    return () => {
      document.removeEventListener("keyup", preventEsc, false);
      document.removeEventListener("keydown", preventEsc, false);
    };
  }, []);
  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <MonacoCodeEditor
          height={"50vh"}
          defaultLanguage="html"
          defaultValue={defaultValue}
          onChange={(value) => {
            setValue(value);
          }}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button minimal={true} text="Close" onClick={onClose} />
          <Button
            type="submit"
            text="Save"
            intent="primary"
            onClick={() => onSubmit(value)}
          />
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
