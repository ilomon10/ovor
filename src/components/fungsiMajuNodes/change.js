import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Component } from "fungsi-maju";
import { Button, Classes, FormGroup, InputGroup, ControlGroup, HTMLSelect, Text } from "@blueprintjs/core";
import { Formik, FieldArray } from "formik";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import { Box } from "components/utility/grid";

const RuleType = {
  "Set": "set",
  "Change": "change",
  "Delete": "delete",
  "Move": "move",
}

export class Change extends Component {
  config = {
    color: "orange"
  }

  constructor() {
    super("Change");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    console.log(nodeView.sockets);

    node.setData("label", node.getData("label") || this.name);
    node.setData("rules", node.getData("rules") || []);

    nodeView.addSocket("input", 0, "Value");
    nodeView.addSocket("output", 0, "Value");
  }

  worker(node, input) {
    return { from: node.id, value: input };
  }

  ConfigView = ConfigView.bind(this)
}

export function ConfigView({ node: nodeView, onClose, onSubmit }) {
  const feathers = useFungsiMaju();
  const defaultValue = useMemo(() => {
    const { node } = nodeView;
    let rules = node.getData("rules");
    return {
      label: node.getData("label"),
      rules: [
        ...rules,
        {
          type: "",
          property: "",
        }
      ]
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
              label="Rules"
            >
              <FieldArray
                name="rules"
                render={arr => values["rules"].map((v, i) => {
                  const error = false;
                  const isLast = !(i < values["rules"].length - 1);
                  return (
                    <FormGroup
                      key={i}
                    >
                      <div className="flex">
                        <Box
                          width={isLast ? "100%" : 1 / 4}
                          flexShrink={0}
                        >
                          <HTMLSelect
                            fill={isLast}
                            name={`rules[${i}].type`}
                            value={v["type"]}
                            options={[
                              { label: "Select to add rule", value: "", disabled: true },
                              { label: "Set", value: "set" },
                              { label: "Change", value: "change" },
                              { label: "Delete", value: "delete" },
                              { label: "Move", value: "move" },
                            ]}
                            onChange={(e) => {
                              const type = e.target.value;
                              console.log(type);
                              setFieldValue(`rules[${i}]`, {
                                type: type,
                                property: v["property"]
                              });

                              if (isLast) arr.push({ type: "", property: "" });
                            }}
                          />
                        </Box>
                        {!isLast &&
                          <Box
                            flexGrow={1}
                          >
                            <InputGroup
                              name={`rules[${i}].property`}
                              value={v["property"]}
                              onChange={handleChange}
                              placeholder="payload"
                              leftElement={(
                                <Box as="span" pl={2} style={{ lineHeight: "30px" }}>msg.</Box>
                              )}
                            />
                            {["set"].indexOf(v["type"]) !== -1 &&
                              <InputGroup
                                name={`rules[${i}].to`}
                                type="text"
                                value={v["to"]}
                                onChange={handleChange} 
                                leftElement={(
                                  <Box as="span" px={2} style={{ lineHeight: "30px" }}>to</Box>
                                )}
                              />}
                            {["change"].indexOf(v["type"]) !== -1  &&
                              <>
                                <InputGroup
                                  name={`rules[${i}].from`}
                                  type="text"
                                  value={v["from"]}
                                  placeholder="something"
                                  onChange={handleChange}
                                  leftElement={(
                                    <Box as="span" px={2} style={{ lineHeight: "30px" }}>Search for</Box>
                                  )}
                                />
                                <InputGroup
                                  name={`rules[${i}].to`}
                                  type="text"
                                  value={v["to"]}
                                  placeholder="something"
                                  onChange={handleChange}
                                  leftElement={(
                                    <Box as="span" px={2} style={{ lineHeight: "30px" }}>Replace with</Box>
                                  )}
                                />
                              </>
                            }
                            {["move"].indexOf(v["type"]) !== -1 &&
                              <InputGroup
                                name={`rules[${i}].to`}
                                type="text"
                                value={v["to"]}
                                placeholder="something"
                                onChange={handleChange}
                                leftElement={(
                                  <Box as="span" px={2} style={{ lineHeight: "30px" }}>to msg.</Box>
                                )}
                              />}
                          </Box>
                        }
                        {!isLast &&
                          <Box flexShrink={0}>
                            <Button
                              minimal={true}
                              icon="trash"
                              intent="danger"
                              onClick={() => {
                                arr.remove(i);
                              }}
                            />
                          </Box>
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