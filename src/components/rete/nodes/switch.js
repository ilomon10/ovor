import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import TextControl from '../controls/text';
import { BooleanSocket, UniversalSocket } from '../sockets';
import { Node } from "../node";
import BooleanControl from "../controls/boolean";

class SwitchComponent extends Rete.Component {
  constructor(config) {
    super("Switch");
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
    var condition = new Rete.Input('cond', 'Value', BooleanSocket);
    var inpTrue = new Rete.Input('inpTrue', 'Is True', UniversalSocket);
    var inpFalse = new Rete.Input('inpFalse', 'Is False', UniversalSocket);
    var output = new Rete.Output("out", "Value", UniversalSocket);

    condition.addControl(new BooleanControl(this.editor, "cond", node, { label: "Condition" }));
    inpTrue.addControl(new TextControl(this.editor, "inpTrue", node, { placeholder: "true" }));
    inpFalse.addControl(new TextControl(this.editor, "inpFalse", node, { placeholder: "false" }));

    return node
      .addInput(condition)
      .addInput(inpTrue)
      .addInput(inpFalse)
      .addOutput(output)
  }

  worker(node, inputs, outputs) {
    let condition = inputs['cond'].length ? inputs['cond'][0] : node.data['cond'];
    let inpTrue = inputs['inpTrue'].length ? inputs['inpTrue'][0] : node.data['inpTrue'];
    let inpFalse = inputs['inpFalse'].length ? inputs['inpFalse'][0] : node.data['inpFalse'];
    let result = inpFalse;

    if (condition) result = inpTrue;

    outputs["out"] = result;
  }
}

export default SwitchComponent;