import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { NumberSocket, TimestampSocket } from '../sockets';

class OutputComponent extends Rete.Component {
  constructor(config) {
    super("GroupOutput");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.DARK_GRAY1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;

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
    outputs["num"] = 0;
  }
}

export default OutputComponent;