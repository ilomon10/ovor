import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';

import { Node } from "../node";
import { DateSocket, NumberSocket } from '../sockets';
import SelectControl from "../controls/select";

class TimeGetterComponent extends Rete.Component {
  constructor(config) {
    super("Time Getter");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'data.type')) {
      node.data.type = 'Date';
    }

    node.meta.color = this.config.color;

    let inputs = [{
      key: "inp",
      title: "Date",
      type: "date"
    }];

    let outputs = [{
      key: "out",
      title: "Value"
    }]

    inputs.forEach(({ key, title, type }) => {
      let socket = NumberSocket;
      if (type === "date") {
        socket = DateSocket;
      }
      let inp = new Rete.Input(key, title, socket);
      node.addInput(inp);
    })

    outputs.forEach(({ key, title }) => {
      let out = new Rete.Output(key, title, NumberSocket);
      node.addOutput(out);
    })

    return node
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Millisecond', 'Second', 'Minute', 'Date', 'Day', 'Month', 'Year']
      }));
  }

  getInputValue(key, node, inputs) {
    return inputs[key].length ? inputs[key][0] : node.data[key];
  }

  worker(node, inputs, outputs) {
    var inp = this.getInputValue("inp", node, inputs);
    
    const nodeClass = this.editor.nodes.find(n => n.id === node.id);

    outputs["out"] = 0;
  }
}

export default TimeGetterComponent;