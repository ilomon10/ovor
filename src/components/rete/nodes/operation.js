import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';

import { Node } from "../node";
import NumControl from '../controls/numeric';
import { NumberSocket } from '../sockets';
import SelectControl from "../controls/select";

class OperationComponent extends Rete.Component {
  constructor(config) {
    super("Operation");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'node.data.type')) {
      node.data.type = 'Add';
    }
    node.meta.color = this.config.color;
    var inp1 = new Rete.Input("num1", "Number", NumberSocket);
    var inp2 = new Rete.Input("num2", "Number2", NumberSocket);
    var out = new Rete.Output("num", "Number", NumberSocket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new SelectControl(this.editor, "type", node, ['Add', 'Subtract', 'Multiply', 'Divide']))
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    let sum = 0;
    switch (node.data.type) {
      case 'Add':
        sum = n1 + n2;
        break;
      case 'Subtract':
        sum = n1 - n2;
        break;
      case 'Multiply':
        sum = n1 * n2;
        break;
      case 'Divide':
        sum = n1 / n2;
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

export default OperationComponent;