import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { NumberSocket, TimestampSocket } from '../sockets';

class OutputComponent extends Rete.Component {
  constructor() {
    super("GroupOutput");
    this.data.component = Node; // optional
  }

  builder(node) {
    node.meta.color = Colors.DARK_GRAY1;

    if (node.data.meta) {
      const meta = node.data.meta;
      meta.inputs.forEach(({ key, name, type }) => {
        let socket;
        switch (type) {
          case 'number':
            socket = NumberSocket;
            break;
          case 'timestamp':
            socket = TimestampSocket;
            break;
          case 'string':
            break;
          default:
            break;
        }
        node.addInput(new Rete.Input(key, `${name}-${type}`, socket))
      })
    }

    return node;
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get("preview")
      .setValue(n1);
    outputs["num"] = n1;
  }
}

export default OutputComponent;