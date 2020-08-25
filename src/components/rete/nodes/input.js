import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { NumberSocket, TimestampSocket } from '../sockets';

class InputComponent extends Rete.Component {
  constructor(feathers) {
    super("GroupInput");
    this.data.component = Node; // optional
    this.feathers = feathers;
  }

  builder(node) {
    node.meta.color = Colors.DARK_GRAY1;
    if (node.data.meta) {
      const meta = node.data.meta;
      meta.outputs.forEach(({ key, name, type }) => {
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
        node.addOutput(new Rete.Output(key, `${name}-${type}`, socket))
      })
    }

    return node;
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default InputComponent;