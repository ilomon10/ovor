import { Component } from "fungsi-maju";

export class DeviceIn extends Component {
  constructor() {
    super("Device In");
  }

  builder(node) {
    node.addSocket("output", 0, "Value");
  }

  worker(node, input) {
    return { from: node.id, value: input };
  }
}

export class DeviceOut extends Component {
  constructor() {
    super("Device Out");
  }

  builder(node) {
    node.addSocket("input", 0, "Value");
  }

  worker(node, input) {
    return null;
  }
}