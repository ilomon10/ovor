import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import NumericControl from '../controls/numeric';
import SelectControl from '../controls/select';
import { NumberSocket } from '../sockets';
import { Node } from "../node";

class RoundingComponent extends Rete.Component {
  constructor(config) {
    super("Rounding");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'data.type'))
      node.data.type = 'Round';
    node.meta.color = this.config.color;
    var input = new Rete.Input('inp', 'Value', NumberSocket);
    var output = new Rete.Output("out", "Value", NumberSocket);

    input.addControl(new NumericControl(this.editor, "inp", node));

    return node
      .addInput(input)
      .addControl(new SelectControl(this.editor, "type", node, ['Round', 'Floor', 'Ceil']))
      .addOutput(output)
  }

  worker(node, inputs, outputs) {
    let input = inputs['inp'].length ? inputs['inp'][0] : node.data['inp'];
    let result = 0;

    switch (node.data.type) {
      case 'Round':
        result = Math.round(input);
        break;
      case 'Floor':
        result = Math.floor(input);
        break;
      case 'Ceil':
        result = Math.ceil(input);
        break;
      default:
        result = 0;
    }

    outputs["out"] = result;
  }
}

export default RoundingComponent;