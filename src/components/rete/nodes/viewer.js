import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { UniversalSocket } from '../sockets';

class ViewerComponent extends Rete.Component {
  constructor(config) {
    super("Viewer");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.DARK_GRAY1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;
    node.addInput(new Rete.Input('val', `Value`, UniversalSocket));
    return node;
  }

  worker(node, inputs, outputs) {
    Object.keys(inputs).forEach((key) => {
      node.data[key] = inputs[key][0];
    })
  }
}

export default ViewerComponent;