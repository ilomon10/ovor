import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { NumberSocket, TimestampSocket } from '../sockets';

class InputComponent extends Rete.Component {
  constructor(config, feathers) {
    super("GroupInput");
    this.data.component = Node; // optional
    this.feathers = feathers;
    this.config = {
      ...config,
      color: Colors.DARK_GRAY1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;
    if (this.config.outputs) {
      const outputs = this.config.outputs;
      outputs.forEach(({ key, name, type }) => {
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
        node.addOutput(new Rete.Output(key, `${name}`, socket))
      })
    }

    return node;
  }

  worker(node, inputs, outputs) {
    if (node.data.meta) {
      node.data.meta.outputs.forEach(s => {
        outputs[s.key] = 1;
      })
    }
  }
}

export default InputComponent;