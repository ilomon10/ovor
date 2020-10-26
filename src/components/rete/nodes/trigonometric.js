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
    if (!_get(node, 'data.type')) {
      node.data.type = 'Sine';
    }
    node.meta.color = this.config.color;
    var inp = new Rete.Input("inp", "Value", NumberSocket);
    var out = new Rete.Output("out", "Value", NumberSocket);

    inp.addControl(new NumControl(this.editor, "inp", node));

    return node
      .addInput(inp)
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Sine', 'Cosine', 'Tangent']
      }))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["inp"].length ? inputs["inp"][0] : node.data["inp"];

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

    outputs["out"] = sum;
  }
}

export default TrigonometricComponent;