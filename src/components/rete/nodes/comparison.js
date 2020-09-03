import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import NumericControl from '../controls/numeric';
import SelectControl from '../controls/select';
import { NumberSocket } from '../sockets';
import { Node } from "../node";

class ComparisonComponent extends Rete.Component {
  constructor(config) {
    super("Comparison");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'data.type'))
      node.data.type = 'Minimum';
    node.meta.color = this.config.color;
    var input = new Rete.Input('inp', 'Value', NumberSocket);
    var comp = new Rete.Input('comp', 'Value', NumberSocket);
    var output = new Rete.Output("out", "Value", NumberSocket);

    input.addControl(new NumericControl(this.editor, "inp", node));
    comp.addControl(new NumericControl(this.editor, "comp", node));

    return node
      .addInput(input)
      .addInput(comp)
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Minimum', 'Maximum', 'Less Than', 'Greater Than']
      }))
      .addOutput(output)
  }

  worker(node, inputs, outputs) {
    let input = inputs['inp'].length ? inputs['inp'][0] : node.data['inp'];
    let comp = inputs['comp'].length ? inputs['comp'][0] : node.data['comp'];
    let result = 0;

    switch (node.data.type) {
      case 'Minimum':
        result = Math.min(input, comp);
        break;
      case 'Maximum':
        result = Math.max(input, comp);
        break;
      case 'Greater Than':
        result = input > comp ? 1 : 0;
        break;
      case 'Less Than':
        result = input < comp ? 1 : 0;
        break;
      default:
        result = 0;
    }

    outputs["out"] = result;
  }
}

export default ComparisonComponent;