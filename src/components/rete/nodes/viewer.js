import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { UniversalSocket } from '../sockets';
import TextControl from "../controls/text";

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
    return node
      .addInput(new Rete.Input('inp', `Value`, UniversalSocket))
      .addControl(new TextControl(this.editor, "val", node, { readOnly: true }));
  }

  async worker(node, inputs, outputs) {
    const nodeClass = this.editor.nodes.find(n => n.id === node.id);
    const control = nodeClass.controls.get('val');
    node.data['val'] = inputs['inp'][0];
    control.setValue(node.data['val']);
  }
}

export default ViewerComponent;