import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { BooleanSocket, StringSocket } from '../sockets';
import TextControl from "../controls/text";
import SelectControl from "../controls/select";
import BooleanControl from "../controls/boolean";
import _get from "lodash.get";

class WebhookComponent extends Rete.Component {
  constructor(config) {
    super("Webhook");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.DARK_GRAY1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;
    if(!_get(node, "data.type"))
      node.data.type = "text/plain";
    if(!_get(node, "data.method"))
      node.data.method = "GET";
    const mute = new Rete.Input('mute', `Mute`, BooleanSocket);
    const inpUrl = new Rete.Input('inp', `URL`, StringSocket);
    const inpBody = new Rete.Input('inp_d', `Body`, StringSocket);

    inpUrl.addControl(new TextControl(this.editor, "inp", node, { placeholder: "URL" }));
    inpBody.addControl(new TextControl(this.editor, "inp_b", node, { placeholder: "Body" }));
    mute.addControl(new BooleanControl(this.editor, "mute", node, { label: "Mute" }));

    return node
      .addInput(mute)
      .addInput(inpUrl)
      .addInput(inpBody)
      .addControl(new SelectControl(this.editor, "method", node, {
        options: ["GET", "POST", "PUT", "DELETE"]
      }))
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ["text/plain", "application/json"]
      }))
      ;
  }

  async worker(node, inputs, outputs) {

  }
}

export default WebhookComponent;