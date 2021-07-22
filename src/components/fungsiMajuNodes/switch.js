import React, { useMemo } from "react";
import { Component } from "fungsi-maju";
import { Button, Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect } from "@blueprintjs/core";
import { Formik, FieldArray } from "formik";
import { Box } from "components/utility/grid";

const RuleType = {
  "equal": "==",
  "not_equal": "!=",
  "more_and_equal": ">=",
  "less_and_equal": "<=",
}

export class Switch extends Component {
  config = {
    color: "orange"
  }

  constructor() {
    super("Switch");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    console.log(nodeView.sockets);

    node.setData("label", node.getData("label") || this.name);
    node.setData("rules", node.getData("rules") || []);
    node.setData("property", node.getData("property") || "");

    nodeView.addSocket("input", 0, "Value");

    let rules = node.metadata.rules;

    rules.forEach(({ rule }, idx) => {
      nodeView.addSocket("output", idx, `${RuleType[rule]}`);
    });
  }

  worker(node, input) {
    return { from: node.id, value: input };
  }

  ConfigView = ConfigView.bind(this)
}

export function ConfigView({ node: nodeView, onClose, onSubmit }) {
  const defaultValue = useMemo(() => {
    const { node } = nodeView;
    let rules = node.getData("rules");
    return {
      label: node.getData("label"),
      property: node.getData("property"),
      rules: [...rules, { rule: "", value: "" }]
    }
  }, [nodeView]);
  return (
    <Formik
      initialValues={defaultValue}
      onSubmit={(values) => {
        const node = nodeView.node;
        let rules = values["rules"];

        if (defaultValue["rules"].length !== rules.length) {
          node.outputs = rules.map(() => []);
        }

        rules.splice(rules.length - 1, 1);
        node.setData('label', values["label"]);
        node.setData('rules', rules);
        node.setData('property', values["property"]);
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
              label="Property"
            >
              <InputGroup
                name="property"
                value={values["property"]}
                onChange={handleChange}
                placeholder="payload"
                leftElement={(
                  <Box as="span" pl={2} style={{ lineHeight: "30px" }}>msg.</Box>
                )}
              />
            </FormGroup>
            <FormGroup
              label="Rules"
            >
              <FieldArray
                name="rules"
                render={arr => values["rules"].map((v, i) => {
                  const error = false;
                  return (
                    <FormGroup
                      key={i}
                    >
                      <div className="flex">
                        <ControlGroup fill={true} className="flex-grow">
                          <HTMLSelect
                            name={`rules[${i}].rule`}
                            value={v.rule}
                            options={[
                              { label: "Select to add rule", value: "", disabled: true },
                              { label: "==", value: "equal" },
                              { label: "!=", value: "not_equal" },
                              { label: ">=", value: "more_and_equal" },
                              { label: "<=", value: "less_and_equal" },
                            ]}
                            onChange={(e) => {
                              handleChange(e);
                              if (i === values["rules"].length - 1)
                                arr.push({ rule: "", value: "" });
                            }}
                          />
                          {i < values["rules"].length - 1 &&
                            <InputGroup
                              name={`rules[${i}].value`}
                              type="text"
                              value={v.value}
                              onChange={handleChange}
                            />}
                        </ControlGroup>
                        {i < values["rules"].length - 1 &&
                          <Button
                            minimal={true}
                            icon="trash"
                            intent="danger"
                            onClick={() => {
                              arr.remove(i);
                            }}
                          />
                        }
                      </div>
                    </FormGroup>
                  )
                })}
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