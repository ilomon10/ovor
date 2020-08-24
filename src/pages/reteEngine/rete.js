import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import { Node } from "./node";
import { Colors } from "@blueprintjs/core";

import backgroundImage from '../../assets/bg-editor.png';
import { numSocket } from './nodes/sockets';
import NumControl from './controls/numeric';
import InputComponent from "./nodes/input";
import OutputComponent from "./nodes/output";
import OperationComponent from "./nodes/operation";

class NumComponent extends Rete.Component {
  constructor() {
    super("Number");
    this.data.component = Node; // optional
  }

  builder(node) {
    node.meta.color = Colors.ORANGE1;
    var out1 = new Rete.Output("num", "Number", numSocket);
    var ctrl = new NumControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export async function createEditor(container) {
  var components = [
    new InputComponent(),
    new OutputComponent(),
    new NumComponent(),
    new OperationComponent()
  ];

  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  const background = document.createElement('div');
  background.classList = 'background';
  background.style.backgroundImage = `url(${backgroundImage})`;
  background.style.opacity = 0.05;
  
  editor.use(AreaPlugin, { background });

  var engine = new Rete.Engine("demo@0.1.0");

  components.forEach(c => {
    editor.register(c);
    engine.register(c);
  });

  var i1 = await components[0].createNode();
  var o1 = await components[1].createNode();
  var n1 = await components[2].createNode({ num: 2 });
  var opr = await components[3].createNode({});

  i1.position = [80, 0];
  o1.position = [800, 200];
  n1.position = [80, 200];
  opr.position = [500, 200];

  editor.addNode(i1);
  editor.addNode(o1);
  editor.addNode(n1);
  editor.addNode(opr);

  editor.connect(n1.outputs.get("num"), opr.inputs.get("num1"));
  editor.connect(i1.outputs.get("num"), opr.inputs.get("num2"));
  editor.connect(opr.outputs.get("num"), o1.inputs.get("num1"));

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
}
