import React, { useMemo } from "react";
import { Component } from "fungsi-maju";
import { Button, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";
import { Box } from "components/utility/grid";

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

    node.setData("label", node.getData("label") || this.name);
    node.setData("property", node.getData("property") || "payload");
    node.setData("key", node.getData("key") || "from");
    node.setData("count", node.getData("count") || 2);

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
      property: node.getData("property"),
      key: node.getData("key"),
      count: node.getData("count"),
    }
  }, [nodeView]);
  return (
    <Formik
      initialValues={defaultValue}
      onSubmit={(values) => {
        const { node } = nodeView;

        node.setData("label", values["label"]);
        node.setData("property", values["property"]);
        node.setData("key", values["key"]);
        node.setData("count", values["count"]);

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
              label="Combine each"
            >
              <InputGroup
                name="property"
                value={values["property"]}
                onChange={handleChange}
                placeholder="payload"
                leftElement={(
                  <Box as="span" pl={2} pr={1} style={{ lineHeight: "30px" }}>msg.</Box>
                )}
              />
            </FormGroup>
            <FormGroup
              label="Using the value of"
            >
              <InputGroup
                name="key"
                value={values["key"]}
                onChange={handleChange}
                placeholder="topic"
                leftElement={(
                  <Box as="span" pl={2} pr={1} style={{ lineHeight: "30px" }}>msg.</Box>
                )}
                rightElement={(
                  <Box as="span" pr={2} style={{ lineHeight: "30px" }}>as the key</Box>
                )}
              />
            </FormGroup>
            <FormGroup
              label="Send after"
            >
              <InputGroup
                name="count"
                value={values["count"]}
                onChange={handleChange}
                placeholder="count"
                rightElement={(
                  <Box as="span" pr={2} style={{ lineHeight: "30px" }}>parts</Box>
                )}
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