import React from "react";
import Rete from "rete";
import { DateInput } from "@blueprintjs/datetime";

class DateControl extends Rete.Control {
  static component = ({ value, onChange, readonly }) => (
    <DateInput
      readOnly={readonly}
      value={value}
      elementRef={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      formatDate={date => date.toLocaleString()}
      parseDate={str => new Date(str)}
      onChange={e => onChange(e)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = DateControl.component;

    const initial = node.data[key] || new Date();

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

export default DateControl;