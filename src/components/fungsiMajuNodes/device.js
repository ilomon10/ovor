import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Component } from "fungsi-maju";
import { Button, Classes, Colors, FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import Select from "components/Select";
import { useFormik } from "formik";
import InputCopy from 'components/inputCopy';
import { Box } from "components/utility/grid";
import { useFeathers } from "components/feathers";

const Element = ({ node }) => {
  const label = node.metadata["label"];
  const device = node.metadata["device"];
  const deviceName = !device ? "unset" : device["name"];
  return (
    <div>
      <div>{label}</div>
      <div>{deviceName}</div>
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

export class DeviceIn extends Component {
  config = {
    color: "black"
  }

  constructor() {
    super("Device In");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    nodeView.addSocket("output", 0, "Value");

    node.metadata.label = node.metadata.label || this.name;
    node.metadata.deviceId = node.metadata["deviceId"] || null;
    node.metadata.device = node.metadata["device"] || null;

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

export class DeviceOut extends Component {
  config = {
    color: "black"
  }

  constructor() {
    super("Device Out");
  }

  async builder(nodeView) {
    const { node } = nodeView;
    nodeView.addSocket("input", 0, "Value");

    node.metadata.label = node.metadata.label || this.name;
    node.metadata.deviceId = node.metadata["deviceId"] || null;
    node.metadata.device = node.metadata["device"] || null;

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
  const [deviceList, setDeviceList] = useState([]);
  const defaultValue = useMemo(() => {
    return {
      label: nodeView.node.metadata["label"],
      deviceId: nodeView.node.metadata["deviceId"]
    }
  }, [nodeView]);
  const {
    values, errors,
    handleSubmit, handleChange,
    setFieldValue, isSubmitting
  } = useFormik({
    initialValues: defaultValue,
    onSubmit: (values) => {
      let device = deviceList.find(d => d["_id"] === values["deviceId"]);
      nodeView.node.metadata['label'] = values["label"];
      nodeView.node.metadata['deviceId'] = values["deviceId"];
      nodeView.node.metadata['device'] = device;
      onSubmit();
    }
  });

  const fields = useMemo(() => {
    let ret = [];
    let device = deviceList.find(dev => values["deviceId"] === dev["_id"]);
    if (device) {
      ret = device.fields;
    }
    return ret;
  }, [values["deviceId"], deviceList]);

  useEffect(() => {
    console.log(feathers);
    const fetch = async () => {
      try {
        const devices = await feathers.devices.find({
          query: {
            $select: ["_id", "name", "fields"]
          }
        });
        setDeviceList(devices.data);
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
          label="Device"
        >
          <Select
            fill={true}
            name="deviceId"
            placeholder="Select device"
            value={values["deviceId"]}
            options={deviceList.map(({ name, _id }) => ({
              label: name,
              value: _id
            }))}
            onChange={(option) => {
              setFieldValue("deviceId", option.value);
            }}
          />
        </FormGroup>
        {values["deviceId"] &&
          <>
            <FormGroup
              label="Device ID"
            >
              <InputCopy fill={true} value={values["deviceId"]} />
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