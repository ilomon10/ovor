import React, { useMemo } from "react";
import { Component } from "fungsi-maju";
import { Button, Classes, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import { Formik } from "formik";
import { Box } from "components/utility/grid";

export class FunctionComponent extends Component {
  config = {
    color: "red"
  }

  constructor() {
    super("Function");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    nodeView.addSocket("input", 0, "Value");
    nodeView.addSocket("output", 0, "Value");

    node.setData("label", node.getData("label") || this.name);
    node.setData("code", node.getData("code") || `\n\nreturn msg;`);

  }

  worker(node, input) {
    return { from: node.id, value: input };
  }

  ConfigView = ConfigView.bind(this)
}

export function ConfigView({ node: nodeView, onClose, onSubmit }) {
  const defaultValue = useMemo(() => {
    const { node } = nodeView;
    return {
      label: node.getData("label"),
      code: node.getData("code"),
    }
  }, [nodeView]);
  return (
    <Formik
      initialValues={defaultValue}
      onSubmit={(values) => {
        const { node } = nodeView;

        node.setData("label", values["label"]);
        node.setData("code", values["code"]);

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
            <FormGroup
              label="Code"
              labelInfo="(Javascript)"
            >
              <TextArea
                fill={true}
                growVertically={true}
                style={{ 
                  resize: "vertical",
                  minHeight: 250
                }}
                name="code"
                value={values["code"]}
                onChange={handleChange}
                placeholder="Write your code here"
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