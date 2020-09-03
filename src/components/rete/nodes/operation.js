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
    if (!_get(node, 'data.type')) {
      node.data.type = 'Add';
    }
    node.meta.color = this.config.color;
    var inp = new Rete.Input("inp", "Value", NumberSocket);
    var inp2 = new Rete.Input("inp2", "Value", NumberSocket);
    var out = new Rete.Output("out", "Value", NumberSocket);

    inp.addControl(new NumControl(this.editor, "inp", node));
    inp2.addControl(new NumControl(this.editor, "inp2", node));

    return node
      .addInput(inp)
      .addInput(inp2)
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Add', 'Subtract', 'Multiply', 'Divide']
      }))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["inp"].length ? inputs["inp"][0] : node.data['inp'];
    var n2 = inputs["inp2"].length ? inputs["inp2"][0] : node.data['inp2'];
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

    if (isNaN(sum)) sum = 0;

    outputs["out"] = sum;
  }
}

export default OperationComponent;