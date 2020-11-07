import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';

import { Node } from "../node";
import { DateSocket, NumberSocket } from '../sockets';

class PIDComponent extends Rete.Component {
  constructor(config) {
    super("PID Controller");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.VERMILION1
    }
  }

  builder(node) {
    if (!_get(node, 'data.type')) {
      node.data.type = 'Add';
    }
    node.meta.color = this.config.color;

    let inputs = [{
      key: "inp",
      title: "Input",
      type: "number"
    }, {
      key: "inp_t",
      title: "Time",
      type: "date"
    }, {
      key: "inp_lt",
      title: "Last Time",
      type: "date"
    }, {
      key: "inp_p",
      title: "Propotional",
      type: "number"
    }, {
      key: "inp_i",
      title: "Integral",
      type: "number"
    }, {
      key: "inp_d",
      title: "Derivative",
      type: "number"
    }, {
      key: "inp_sp",
      title: "Set Point",
      type: "number"
    }, {
      key: "inp_le",
      title: "Last Error",
      type: "number"
    }, {
      key: "inp_se",
      title: "Last Sum Error",
      type: "number"
    }];

    let outputs = [{
      key: "out",
      title: "Output"
    }, {
      key: "out_e",
      title: "Error"
    }, {
      key: "out_se",
      title: "Sum Error"
    }]

    inputs.forEach(({ key, title, type }) => {
      let socket = NumberSocket;
      if (type === "date") {
        socket = DateSocket;
      }
      let inp = new Rete.Input(key, title, socket);
      // inp.addControl(new NumControl(this.editor, key, node));
      node.addInput(inp);
    })

    outputs.forEach(({ key, title }) => {
      let out = new Rete.Output(key, title, NumberSocket);
      node.addOutput(out);
    })

    return node;
  }

  getInputValue(key, node, inputs) {
    return inputs[key].length ? inputs[key][0] : node.data[key];
  }

  worker(node, inputs, outputs) {
    var inp = this.getInputValue("inp", node, inputs);
    var inp_t = this.getInputValue("inp_t", node, inputs);
    var inp_lt = this.getInputValue("inp_lt", node, inputs);
    var inp_p = this.getInputValue("inp_p", node, inputs);
    var inp_i = this.getInputValue("inp_i", node, inputs);
    var inp_d = this.getInputValue("inp_d", node, inputs);
    var inp_sp = this.getInputValue("inp_sp", node, inputs);
    var inp_le = this.getInputValue("inp_le", node, inputs);
    var inp_se = this.getInputValue("inp_se", node, inputs);

    let dt = 1;

    if (inp_lt === 0) {
      dt = 0;
    } else {
      dt = (inp_t - inp_lt) / 1000; // in seconds
    }

    let error = (inp_sp - inp);
    let sumError = inp_se + error * dt;
    let dError = (error - inp_le) / dt;

    let sum = (inp_p * error) + (inp_i * sumError) + (inp_d * dError);

    if (isNaN(sum)) sum = 0;

    outputs["out"] = sum;
    outputs["out_e"] = error;
    outputs["out_se"] = sumError;
  }
}

export default PIDComponent;