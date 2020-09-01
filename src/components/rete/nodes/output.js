import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { NumberSocket, DateSocket, StringSocket, BooleanSocket } from '../sockets';

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
    if (this.config.inputs) {
      const inputs = this.config.inputs;
      inputs.forEach(({ key, name, type }) => {
        let socket;
        switch (type) {
          case 'number':
            socket = NumberSocket;
            break;
          case 'date':
            socket = DateSocket;
            break;
          case 'boolean':
            socket = BooleanSocket;
            break;
          case 'string':
          default:
            socket = StringSocket;
        }
        node.addInput(new Rete.Input(key, `${name}`, socket))
      })
    }
    return node;
  }

  worker(node, inputs, outputs) {
    Object.keys(inputs).forEach((key) => {
      node.data[key] = inputs[key][0];
    })
  }
}

export default OutputComponent;