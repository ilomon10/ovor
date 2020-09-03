import React from "react";
import Rete from "rete";
import { Switch } from '@blueprintjs/core';

class BooleanControl extends Rete.Control {
  static component = ({ value, onChange, label, readonly }) => (
    <Switch
      style={{ marginBottom: 0, lineHeight: '29px' }}
      checked={value}
      label={label}
      readOnly={readonly}
      inputRef={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      onChange={() => {
        onChange(!value);
      }}
    />
  );

  constructor(emitter, key, node, options) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = BooleanControl.component;

    const initial = node.data[key] || false;

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

export default BooleanControl;