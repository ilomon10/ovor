import React from "react";
import Rete from "rete";
import { InputGroup } from '@blueprintjs/core';

class TextControl extends Rete.Control {
  static component = ({ value, onChange, readonly }) => (
    <InputGroup
      type="text"
      readOnly={readonly}
      value={value}
      elementRef={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      onChange={e => onChange(e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextControl.component;

    const initial = node.data[key] || '';

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
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

export default TextControl;