import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Component } from "fungsi-maju";
import { Button, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import Select from "components/Select";
import { Formik } from "formik";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import { render } from "./device";

export class Join extends Component {
  config = {
    color: "orange"
  }

  constructor() {
    super("Join");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    nodeView.addSocket("input", 0, "Value");
    nodeView.addSocket("output", 0, "Value");

    node.metadata.label = node.metadata.label || this.name;
    node.metadata.deviceId = null;

    const oldRender = nodeView.render;

    nodeView.render = () => {
      const result = oldRender.apply(nodeView);
      render.apply(nodeView);
      return result;
    };
    nodeView.render();
  }

  worker(node, input) {
    return { from: node.id, value: input };
  }

  ConfigView = ConfigView.bind(this)
}

export function ConfigView({ node: nodeView, onClose, onSubmit }) {
  const feathers = useFungsiMaju();
  const defaultValue = useMemo(() => {
    return {
      label: nodeView.node.metadata["label"]
    }
  }, [nodeView]);
  useEffect(() => {
    console.log(feathers);
    // console.log(this.name);
    // console.log(nodeView, this);
  }, []);
  return (
    <Formik
      initialValues={defaultValue}
      onSubmit={(values) => {
        nodeView.node.metadata['label'] = values["label"];
        nodeView.node.metadata['deviceId'] = values["deviceId"];
        nodeView.view.rerenderNode();
        onSubmit();
      }}
    >
      {({ values, errors, handleSubmit, handleChange, setFieldValue }) =>
        <form onSubmit={handleSubmit}>
          <div className={Classes.DIALOG_BODY}>
            <FormGroup
              label="Node Name"
            >
              <InputGroup
                name="label"
                value={values["label"]}
                onChange={handleChange}
              />
            </FormGroup>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button minimal={true} text="Close" onClick={onClose} />
              <Button type="submit" text="Save" intent="primary" />
            </div>
          </div>
        </form>
      }
    </Formik>
  )
}