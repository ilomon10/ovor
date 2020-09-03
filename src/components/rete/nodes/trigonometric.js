import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import { Node } from "../node";
import NumControl from '../controls/numeric';
import { NumberSocket } from '../sockets';
import SelectControl from "../controls/select";

class TrigonometricComponent extends Rete.Component {
  constructor(config) {
    super("Trigonometric");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'node.data.type')) {
      node.data.type = 'Sine';
    }
    node.meta.color = this.config.color;
    var inp1 = new Rete.Input("num1", "Value", NumberSocket);
    var out = new Rete.Output("num", "Value", NumberSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));

    return node
      .addInput(inp1)
      .addControl(new SelectControl(this.editor, "type", node, ['Sine', 'Cosine', 'Tangent']))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    console.log(node.data);
    let sum = 0;
    switch (node.data.type) {
      case 'Sine':
        sum = Math.sin(n1);
        break;
      case 'Cosine':
        sum = Math.cos(n1);
        break;
      case 'Tangent':
        sum = Math.tan(n1);
        break;
      default:
        sum = 0;
    }

    outputs["num"] = sum;
  }
}

export default TrigonometricComponent;