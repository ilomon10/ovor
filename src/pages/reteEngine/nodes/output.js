import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import NumControl from '../controls/numeric';
import { numSocket } from './sockets';

class OutputComponent extends Rete.Component {
  constructor() {
    super("GroupOutput");
    this.data.component = Node; // optional
  }

  builder(node) {
    node.meta.color = Colors.DARK_GRAY1;
    var inp1 = new Rete.Input("num1", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));

    return node
      .addInput(inp1)
      .addControl(new NumControl(this.editor, "preview", node, true));
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get("preview")
      .setValue(n1);
    outputs["num"] = n1;
  }
}

export default OutputComponent;