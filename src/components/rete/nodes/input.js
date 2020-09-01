import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { NumberSocket, DateSocket, StringSocket, BooleanSocket } from '../sockets';

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
        node.addOutput(new Rete.Output(key, `${name}`, socket))
      })
    }

    return node;
  }

  worker(node, inputs, outputs) {
    this.config.outputs.forEach(s => {
      outputs[s.key] = 0;
    })
  }
}

export default InputComponent;