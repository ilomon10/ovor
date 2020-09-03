import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import BooleanControl from '../controls/boolean';
import TextControl from '../controls/text';
import { UniversalSocket, BooleanSocket } from '../sockets';

class LoggerComponent extends Rete.Component {
  constructor(config) {
    super("Logger");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.DARK_GRAY1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;
    const mute = new Rete.Input('mute', `Mute`, BooleanSocket);
    const msg = new Rete.Input('msg', `Message`, UniversalSocket);

    mute.addControl(new BooleanControl(this.editor, 'mute', node, { label: 'Mute' }));
    msg.addControl(new TextControl(this.editor, 'msg', node));

    return node
      .addInput(mute)
      .addInput(msg);
  }

  worker(node, inputs, outputs) {
    console.log(inputs['mute'][0]);
  }
}

export default LoggerComponent;