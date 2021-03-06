import React from "react";
import Rete from "rete";
import { HTMLSelect } from "@blueprintjs/core";

class SelectControl extends Rete.Control {
  static component = ({ value, onChange, options, readOnly }) => (
    <HTMLSelect fill
      value={value}
      disabled={readOnly}
      elementRef={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      onChange={e => onChange(e.target.value)}
      options={options} />
  );

  constructor(emitter, key, node, options) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SelectControl.component;

    const initial = node.data[key];

    node.data[key] = initial;
    this.props = {
      readOnly: false,
      value: initial,
      ...options,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger("process");
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

export default SelectControl;