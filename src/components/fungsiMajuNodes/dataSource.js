import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Component } from "fungsi-maju";
import { Button, Classes, Colors, FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import Select from "components/Select";
import { useFormik } from "formik";
import { useFungsiMaju } from "components/hocs/fungsiMaju";
import InputCopy from 'components/inputCopy';
import { Box } from "components/utility/grid";
import { useFeathers } from "components/feathers";

const Element = ({ node }) => {
  const label = node.getData("label");
  const dataSource = node.getData("dataSource");
  const dataSourceName = !dataSource ? "unset" : dataSource["name"];
  return (
    <div>
      <div>{label}</div>
      <div>{dataSourceName}</div>
    </div>
  )
}

export function render() {
  // console.log(node);
  const el = this.element.content;
  const node = this.node;
  return new Promise((res) => ReactDOM.render((
    <Element node={node} nodeView={this} />
  ), el, res))
}

export class DataSourceIn extends Component {
  config = {
    color: "black"
  }

  constructor() {
    super("Ember In");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    nodeView.addSocket("output", 0, "Value");

    node.setData("label", node.getData("label") || this.name);
    node.setData("dataSourceId", node.getData("dataSourceId") || null);
    node.setData("dataSource", node.getData("dataSource") || null);

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

export class DataSourceOut extends Component {
  config = {
    color: "black"
  }

  constructor() {
    super("Ember Out");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    nodeView.addSocket("input", 0, "Value");

    node.setData("label", node.getData("label") || this.name);
    node.setData("dataSourceId", node.getData("dataSourceId") || null);
    node.setData("dataSource", node.getData("dataSource") || null);

    const oldRender = nodeView.render;

    nodeView.render = () => {
      const result = oldRender.apply(nodeView);
      render.apply(nodeView);
      return result;
    };
    nodeView.render();
  }

  worker(node, input) {
    return null;
  }

  ConfigView = ConfigView.bind(this)
}

export function ConfigView({ node: nodeView, onClose, onSubmit }) {
  const feathers = useFeathers();
  const [dataSourceList, setDataSourceList] = useState([]);
  const defaultValue = useMemo(() => {
    const { node } = nodeView;
    return {
      label: node.getData("label"),
      dataSourceId: node.getData("dataSourceId")
    }
  }, [nodeView]);
  const {
    values, errors,
    handleSubmit, handleChange,
    setFieldValue, isSubmitting
  } = useFormik({
    initialValues: defaultValue,
    onSubmit: (values) => {
      const { node } = nodeView;
      let dataSource = dataSourceList.find(d => d["_id"] === values["dataSourceId"]);

      node.setData('label', values["label"]);
      node.setData('dataSourceId', values["dataSourceId"]);
      node.setData('dataSource', dataSource);

      console.log(dataSource, dataSourceList);

      onSubmit();
    }
  });

  const fields = useMemo(() => {
    let ret = [];
    let dataSource = dataSourceList.find(val => values["dataSourceId"] === val["_id"]);
    if (dataSource) {
      ret = dataSource.fields;
    }
    return ret;
  }, [values["dataSourceId"], dataSourceList]);

  useEffect(() => {
    console.log(feathers);
    const fetch = async () => {
      try {
        const dataSources = await feathers.dataSources.find({
          query: {
            $select: ["_id", "name", "fields"]
          }
        });
        setDataSourceList(dataSources.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetch();
  }, []);
  return (
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
          label="Ember"
        >
          <Select
            fill={true}
            name="dataSourceId"
            placeholder="Select ember"
            value={values["dataSourceId"]}
            options={dataSourceList.map(({ name, _id }) => ({
              label: name,
              value: _id
            }))}
            onChange={(option) => {
              setFieldValue("dataSourceId", option.value);
            }}
          />
        </FormGroup>
        {values["dataSourceId"] &&
          <>
            <FormGroup
              label="Data Source ID"
            >
              <InputCopy fill={true} value={values["dataSourceId"]} />
            </FormGroup>
            <FormGroup
              label="Available Fields"
            >
              <Box
                py={1}
                my={-1}
                borderRadius={4}
                backgroundColor={Colors.LIGHT_GRAY5}
              >
                {fields.map(({ _id, name, type }) => (
                  <Box as="span" key={_id} my={1} mx={1}>
                    <Tag key={_id} minimal={true}>{name}: <span style={{ fontFamily: "monospace" }}>{type}</span></Tag>
                  </Box>
                ))}
              </Box>
            </FormGroup>
          </>}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button minimal={true} text="Close" onClick={onClose} />
          <Button type="submit" text="Save" intent="primary" loading={isSubmitting} />
        </div>
      </div>
    </form>
  )
}