import React from "react";
import Rete from "rete";
import { HTMLSelect } from "@blueprintjs/core";

class SelectControl extends Rete.Control {
  static component = ({ value, onChange, options }) => (
    <HTMLSelect fill
      value={value}
      elementRef={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      onChange={e => onChange(e.target.value)}
      options={options} />
  );

  constructor(emitter, key, node, options, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SelectControl.component;

    const initial = node.data[key] || 'Add';

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      options: options,
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