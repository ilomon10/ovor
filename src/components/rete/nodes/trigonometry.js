import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import { Node } from "../node";
import NumControl from '../controls/numeric';
import { NumberSocket } from '../sockets';
import SelectControl from "../controls/select";

class TrigonometryComponent extends Rete.Component {
  constructor(config) {
    super("Trigonometry");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'node.data.type')) {
      node.data.type = 'Sin';
    }
    node.meta.color = this.config.color;
    var inp1 = new Rete.Input("num1", "Number", NumberSocket);
    var out = new Rete.Output("num", "Number", NumberSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));

    return node
      .addInput(inp1)
      .addControl(new SelectControl(this.editor, "type", node, ['Sin', 'Cos', 'Tan']))
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    console.log(node.data);
    let sum = 0;
    switch (node.data.type) {
      case 'Sin':
        sum = Math.sin(n1);
        break;
      case 'Cos':
        sum = Math.cos(n1);
        break;
      case 'Tan':
        sum = Math.tan(n1);
        break;
      default:
        sum = 0;
    }

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}

export default TrigonometryComponent;