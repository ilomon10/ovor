import React from 'react';
import ReteJS from "rete";
import AreaPlugin from "rete-area-plugin";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import InputComponent from 'components/rete/nodes/input';
import OutputComponent from 'components/rete/nodes/output';
import OperationComponent from 'components/rete/nodes/operation';
import NumericComponent from 'components/rete/nodes/numeric';
import backgroundImage from '../../assets/bg-editor.png';

const ReteEngineContext = React.createContext(null);

class Rete {
  constructor() {
    this.engine = new ReteJS.Engine("demo@0.1.0");
    this.editor = null;
    this.components = [
      new InputComponent(),
      new OutputComponent(),
      new NumericComponent(),
      new OperationComponent()
    ];
  }

  createEditor(container) {

    const components = this.components;
    const editor = new ReteJS.NodeEditor("demo@0.1.0", container);
    this.editor = editor;

    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);

    const background = document.createElement('div');
    background.classList = 'background';
    background.style.backgroundImage = `url(${backgroundImage})`;
    background.style.opacity = 0.05;

    editor.use(AreaPlugin, { background });

    const engine = this.engine;

    components.forEach(c => {
      editor.register(c);
      engine.register(c);
    });

    editor.view.resize();
    // editor.trigger("process");
    // AreaPlugin.zoomAt(editor, editor.nodes);
    return editor;
  }
}

export const ReteEngineProvider = ({ children }) => {
  return (
    <ReteEngineContext.Provider value={new Rete()}>
      {children}
    </ReteEngineContext.Provider>
  )
}

export default ReteEngineContext;
