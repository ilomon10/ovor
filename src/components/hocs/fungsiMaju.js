import React, { createContext, useState, useCallback, useContext } from "react";
import { Editor } from "fungsi-maju";

const FungsiMajuContext = createContext(null);

export const FungsiMajuProvider = ({ children, version, components }) => {
  const [editor, setEditor] = useState(null);

  const createEditor = useCallback((container) => {
    const editor = new Editor(version, container);
    setEditor(editor);
    return editor;
  }, [version])
  return (
    <FungsiMajuContext.Provider value={{
      createEditor,
      editor,
      components
    }}>
      {children}
    </FungsiMajuContext.Provider>
  )
}

export const useFungsiMaju = () => {
  const fungsiMaju = useContext(FungsiMajuContext);
  return fungsiMaju;
}