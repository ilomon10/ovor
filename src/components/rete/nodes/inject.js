import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import NumericControl from "../controls/numeric";
import BooleanControl from "../controls/boolean";
import TextControl from "../controls/text";
import DateControl from "../controls/date";
import SelectControl from "../controls/select";
import { BooleanSocket, StringSocket, NumberSocket, DateSocket } from '../sockets';
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
      case 'Date':
        socket = DateSocket;
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
      case 'Date':
        control = DateControl;
        break;
      default: break;
    }
    return control;
  }
  builder(node) {
    if (!_get(node, 'data.type'))
      node.data.type = 'Boolean';

    node.meta.color = this.config.color;
    const Control = this.selectControl(node.data.type);
    const Socket = this.selectSocket(node.data.type);
    const output = new Rete.Output("out", "Value", Socket);

    return node
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Boolean', 'String', 'Numeric', 'Date']
      }))
      .addControl(new Control(this.editor, "inp", node))
      .addOutput(output);
  }

  async worker(node, inputs, outputs) {
    const nodeClass = this.editor.nodes.find(n => n.id === node.id);

    const output = nodeClass.outputs.get('out');
    const selected = this.selectSocket(node.data.type);

    if (output.socket !== selected) {
      if (output.hasConnection()) {
        output.connections.forEach(conn => {
          this.editor.removeConnection(conn);
        })
      }
      const Control = this.selectControl(node.data.type);
      nodeClass.removeControl(nodeClass.controls.get('inp'));
      nodeClass.removeOutput(nodeClass.outputs.get('out'));
      await nodeClass.update();
      nodeClass.addControl(new Control(this.editor, "inp", node));
      nodeClass.addOutput(new Rete.Output('out', `Value`, selected));
      await nodeClass.update();
    }

    const inputValue = node.data['inp'];
    let outputValue;

    switch (node.data.type) {
      case 'Boolean':
        outputValue = Boolean(inputValue);
        break;
      case 'String':
        outputValue = String(inputValue);
        break;
      case 'Numeric':
        outputValue = Number(inputValue);
        break;
      case 'Date':
        if (!(inputValue instanceof Date))
          outputValue = new Date();
        else
          outputValue = inputValue;
        break;
      default: break;
    }
    
    outputs['out'] = outputValue;
  }
}

export default InjectComponent;