import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import NumericControl from '../controls/numeric';
import { NumberSocket } from '../sockets';
import { Node } from "../node";

class NumericComponent extends Rete.Component {
  constructor() {
    super("Number");
    this.data.component = Node; // optional
  }

  builder(node) {
    node.meta.color = Colors.ORANGE1;
    var out1 = new Rete.Output("num", "Number", NumberSocket);
    var ctrl = new NumericControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default NumericComponent;