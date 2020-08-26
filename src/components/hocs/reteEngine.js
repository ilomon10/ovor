import React, { useState, useCallback } from 'react';
import ReteJS from "rete";
import AreaPlugin from "rete-area-plugin";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";

import backgroundImage from '../../assets/bg-editor.png';

const ReteEngineContext = React.createContext(null);

export const ReteEngineProvider = ({ children, components }) => {
  const [editor, setEditor] = useState(null);
  const [engine] = useState(new ReteJS.Engine("demo@0.1.0"));
  const createEditor = useCallback((container) => {
    const editor = new ReteJS.NodeEditor("demo@0.1.0", container);
    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);

    const background = document.createElement('div');
    background.classList = 'background';
    background.style.backgroundImage = `url(${backgroundImage})`;
    background.style.opacity = 0.05;

    editor.use(AreaPlugin, { background });

    components.forEach(c => {
      try {
        editor.register(c);
        engine.register(c);
      } catch (e) {
        return;
      }
    });

    editor.view.resize();
    // editor.trigger("process");
    // AreaPlugin.zoomAt(editor, editor.nodes);
    setEditor(editor);
    return editor;
  }, [components]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ReteEngineContext.Provider value={{
      createEditor,
      editor,
      engine,
      components
    }}>
      {children}
    </ReteEngineContext.Provider>
  )
}

export default ReteEngineContext;
