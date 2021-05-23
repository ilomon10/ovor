import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { Node } from "../node";
import { StringSocket } from '../sockets';
import TextControl from "../controls/text";

class ReplaceComponent extends Rete.Component {
  constructor(config) {
    super("Replace");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.ORANGE1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;
    const inp = new Rete.Input('inp', `String`, StringSocket);
    const inpS = new Rete.Input('inp_s', `Value`, StringSocket);
    const inpN = new Rete.Input('inp_n', `Value`, StringSocket);
    const out = new Rete.Output('out', `Value`, StringSocket);

    inp.addControl(new TextControl(this.editor, "inp", node, { placeholder: "String" }));
    inpS.addControl(new TextControl(this.editor, "inp_s", node, { placeholder: "Search Value" }));
    inpN.addControl(new TextControl(this.editor, "inp_n", node, { placeholder: "New Value" }));

    return node
      .addInput(inp)
      .addInput(inpS)
      .addInput(inpN)
      .addOutput(out)
      ;
  }

  async worker(node, inputs, outputs) {
    let inp = inputs["inp"].length ? inputs["inp"][0] : node.data["inp"];
    let inpS = inputs["inp_s"].length ? inputs["inp_s"][0] : node.data["inp_s"];
    let inpN = inputs["inp_n"].length ? inputs["inp_n"][0] : node.data["inp_n"];
    let value = inp.replace(inpS, inpN);
    outputs["out"] = value;
  }
}

export default ReplaceComponent;