import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import { BooleanSocket, UniversalSocket } from '../sockets';
import { Node } from "../node";
import BooleanControl from "../controls/boolean";

class IsEmptyComponent extends Rete.Component {
  constructor(config) {
    super("IsEmpty");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    node.meta.color = this.config.color;

    var input = new Rete.Input("inp", "Value", UniversalSocket);
    var output = new Rete.Output("out", "Value", BooleanSocket);

    input.addControl(new BooleanControl(this.editor, "inp", node, { label: "Value" }));

    return node
      .addInput(input)
      .addOutput(output)
  }

  worker(node, inputs, outputs) {
    let input = inputs["inp"].length ? inputs["inp"][0] : node.data["inp"];
    let result = false;

    if (typeof input === "undefined") result = true;

    outputs["out"] = result;
  }
}

export default IsEmptyComponent;