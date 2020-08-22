import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import NumControl from '../controls/numeric';
import { numSocket } from './sockets';

class InputComponent extends Rete.Component {
  constructor() {
    super("GroupInput");
    this.data.component = Node; // optional
  }

  builder(node) {
    node.meta.color = Colors.DARK_GRAY1;
    var out1 = new Rete.Output("num", "Number", numSocket);
    var ctrl = new NumControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default InputComponent;