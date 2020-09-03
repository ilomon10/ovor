import Rete from "rete";
import { Colors } from "@blueprintjs/core";
import _get from 'lodash.get';
import { Node } from "../node";
import SelectControl from '../controls/select';
import { UniversalSocket, BooleanSocket, StringSocket, NumberSocket } from '../sockets';
import TextControl from "../controls/text";

class ConversionComponent extends Rete.Component {
  constructor(config) {
    super("Conversion");
    this.data.component = Node; // optional
    this.config = {
      ...config,
      color: Colors.DARK_GRAY1
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

  builder(node) {
    if (!_get(node, 'data.type'))
      node.data.type = 'Boolean';

    node.meta.color = this.config.color;

    const input = new Rete.Input('inp', `Value`, UniversalSocket);
    const output = new Rete.Output('out', `Value`, this.selectSocket(node.data.type));

    input.addControl(new TextControl(this.editor, 'inp', node));

    return node
      .addControl(new SelectControl(this.editor, "type", node, {
        options: ['Boolean', 'String', 'Numeric']
      }))
      .addInput(input)
      .addOutput(output);
  }

  worker(node, inputs, outputs) {
    const nodeClass = this.editor.nodes.find(n => n.id === node.id);

    const output = nodeClass.outputs.get('out');
    const selected = this.selectSocket(node.data.type);

    if (output.socket !== selected) {
      if (output.hasConnection()) {
        output.connections.forEach(conn => {
          this.editor.removeConnection(conn);
        })
      }
      nodeClass.removeOutput(nodeClass.outputs.get('out'));
      nodeClass.addOutput(new Rete.Output('out', `Value`, selected));
      nodeClass.update();
    }

    const inputValue = inputs['inp'].length ? inputs['inp'][0] : node.data['inp'];
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
      default: break;
    }

    outputs['out'] = outputValue;
  }
}

export default ConversionComponent;