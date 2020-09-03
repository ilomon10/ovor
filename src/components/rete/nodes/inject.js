import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import NumericControl from '../controls/numeric';
import BooleanControl from "../controls/boolean";
import TextControl from "../controls/text";
import SelectControl from "../controls/select";
import { BooleanSocket, StringSocket, NumberSocket } from '../sockets';
import { Node } from "../node";

class InjectComponent extends Rete.Component {
  constructor(config) {
    super("Inject");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.ORANGE1
    }
  }

  selectSocket(type) {
    let socket;
    switch (type) {
      case 'Boolean':
        socket = BooleanSocket;
        break;
      case 'String':
        socket = StringSocket;
        break;
      case 'Numeric':
        socket = NumberSocket;
        break;
      default: break;
    }
    return socket;
  }
  selectControl(type) {
    let control;
    switch (type) {
      case 'Boolean':
        control = BooleanControl;
        break;
      case 'String':
        control = TextControl;
        break;
      case 'Numeric':
        control = NumericControl;
        break;
      default: break;
    }
    return control;
  }

  builder(node) {
    node.meta.color = this.config.color;
    if (!_get(node, 'data.type'))
      node.data.type = 'Boolean';

    const Control = this.selectControl(node.data.type);
    const Socket = this.selectSocket(node.data.type);
    var output = new Rete.Output("out", "Value", Socket);

    return node
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Boolean', 'String', 'Numeric']
      }))
      .addControl(new Control(this.editor, "inp", node))
      .addOutput(output);
  }

  worker(node, inputs, outputs) {
    outputs["out"] = node.data.num;
  }
}

export default InjectComponent;