import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import {
  Classes,
  Callout,
  FormGroup,
  ControlGroup,
  InputGroup,
  HTMLSelect,
  Button,
  Icon,
  Collapse,
} from "@blueprintjs/core";

import DashboardContext from "components/hocs/dashboard";
import { FeathersContext } from "components/feathers";
import { Box, Flex } from "components/utility/grid";
import Select from "components/Select";

import { GRAPH_TYPE, GRAPH_OPTIONS, GRAPH_CONFIG } from "./constants";
import WidgetContext from "./hocs";
import SettingsOptions from "./settings.options";
const Schema = Yup.object().shape({
  widgetTitle: Yup.string()
    .min(3, "Too Short!")
    .max(36, "Too Long!")
    .required("Fill this field"),
  widgetType: Yup.string().notOneOf(["empty"], "Cant be empty"),
  widgetOption: Yup.mixed(),
  widgetSeries: Yup.array()
    .transform((arr) => {
      arr.pop();
      return arr;
    })
    .min(1, "Min have 1 series")
    .max(7, "Min have 7 series")
    .of(
      Yup.object().shape({
        type: Yup.string(),
        id: Yup.string().required("Req"),
        field: Yup.string().required("Req"),
      })
    ),
});

const Settings = ({ onClose }) => {
  const dashboard = useContext(DashboardContext);
  const feathers = useContext(FeathersContext);
  const widget = useContext(WidgetContext);
  const [devices, setDevices] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [optionsIsOpen, setOptionsIsOpen] = useState(false);
  const [loading, setLoading] = useState({
    source: false,
  });

  const sources = useMemo(() => {
    return [
      ...devices.map((device) => {
        return {
          label: device["name"],
          info: "device",
          value: device["_id"],
        };
      }),
      ...dataSources.map((e) => {
        return {
          label: e["name"],
          info: "ember",
          value: e["_id"],
        };
      }),
    ];
  }, [devices, dataSources]);

  const fetchSource = useCallback(async () => {
    setLoading((loading) => ({ ...loading, source: true }));
    try {
      let resDevice = await feathers["devices"].find({
        query: { $select: ["_id", "name", "fields"] },
      });
      let resDataSource = await feathers["dataSources"].find({
        query: { $select: ["_id", "name", "fields"] },
      });
      setDevices([...resDevice.data]);
      setDataSources([...resDataSource.data]);
    } catch (err) {
      console.error(err);
    }
    setLoading((loading) => ({ ...loading, source: true }));
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSource();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Formik
      initialValues={{
        widgetTitle: widget.title,
        widgetType: widget.type || "empty",
        widgetOptions: { ...widget.options },
        widgetSeries: [...widget.series, { type: "", id: "", field: "" }],
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        let options = values["widgetOptions"];
        let series = values["widgetSeries"].slice(
          0,
          values["widgetSeries"].length - 1
        );

        try {
          let { widgets } = await feathers.dashboards.get(dashboard.getId(), {
            query: { $select: ["widgets"] },
          });
          widgets = widgets.map((value) => {
            if (value._id !== widget.id) return value;
            return {
              ...value,
              title: values["widgetTitle"],
              type: values["widgetType"],
              options,
              series,
            };
          });
          await feathers.dashboards.patch(dashboard.getId(), {
            widgets: widgets,
          });
          dashboard.patchWidget(widget.id, (value) => {
            return {
              ...value,
              title: values["widgetTitle"],
              type: values["widgetType"],
              options,
              series,
            };
          });
          onClose();
        } catch (e) {
          console.error(e);
          setErrors({ submit: e.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit,
        handleBlur,
        handleReset,
        isSubmitting,
        setFieldValue,
        touched,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              {errors.submit && (
                <Callout intent="danger" style={{ marginBottom: 15 }}>
                  {errors.submit}
                </Callout>
              )}
              <FormGroup
                label="Title"
                labelInfo="(required)"
                intent={errors.widgetTitle ? "danger" : "none"}
                helperText={errors.widgetTitle}
              >
                <InputGroup
                  type="text"
                  name="widgetTitle"
                  value={values["widgetTitle"]}
                  intent={errors.widgetTitle ? "danger" : "none"}
                  onChange={(e) => {
                    handleChange(e);
                    handleBlur(e);
                  }}
                />
              </FormGroup>
              <FormGroup
                label="Type"
                intent={errors.widgetType ? "danger" : "none"}
                helperText={errors.widgetType}
              >
                <HTMLSelect
                  fill
                  name="widgetType"
                  value={values.widgetType}
                  intent={errors.widgetType ? "danger" : "none"}
                  options={[
                    {
                      label: "Choose widget type",
                      value: "empty",
                      disabled: true,
                    },
                    ...Object.keys(GRAPH_TYPE).map((v) => ({
                      label: v,
                      value: GRAPH_TYPE[v],
                    })),
                  ]}
                  onChange={async (e) => {
                    await handleChange(e);
                    await handleBlur(e);
                    await setFieldValue(`widgetOptions`, {});
                  }}
                />
              </FormGroup>
              {GRAPH_CONFIG[values["widgetType"]] &&
                GRAPH_CONFIG[values["widgetType"]]["seriesEnabled"] && (
                  <FieldArray
                    name="widgetSeries"
                    render={(arr) => (
                      <FormGroup
                        label="Series"
                        labelInfo={`(${values.widgetSeries.length - 1})`}
                        // intent={errors.widgetSeries && Object.keys(errors.widgetSeries).length > 0 ? "danger" : "none"}
                        // helperText={errors.widgetSeries && Object.values(errors.widgetSeries)[0]}
                      >
                        {values.widgetSeries.map((v, i) => (
                          <div
                            key={i}
                            className="flex"
                            style={{
                              marginBottom:
                                i !== values.widgetSeries.length - 1 ? 12 : 0,
                            }}
                          >
                            <Flex flexGrow={1}>
                              <Box width={v[`type`] ? "50%" : "100%"}>
                                <Select
                                  placeholder={
                                    !v["type"] && "Select to add new source"
                                  }
                                  fill={true}
                                  style={{
                                    borderRadius: v[`type`]
                                      ? "3px 0 0 3px"
                                      : "3px",
                                    borderLeft: 0,
                                  }}
                                  options={sources}
                                  value={v["id"]}
                                  onOpening={() => fetchSource()}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `widgetSeries[${i}].field`,
                                      ""
                                    );
                                    setFieldValue(
                                      `widgetSeries[${i}].type`,
                                      e["info"] === "ember"
                                        ? "dataSource"
                                        : "device"
                                    );
                                    setFieldValue(
                                      `widgetSeries[${i}].id`,
                                      e["value"]
                                    );
                                    if (i === values.widgetSeries.length - 1)
                                      arr.push({ id: "", type: "", field: "" });
                                  }}
                                />
                              </Box>
                              {v[`type`] && (
                                <Box width="50%">
                                  <HTMLSelect
                                    fill={true}
                                    name={`widgetSeries[${i}].field`}
                                    style={{
                                      borderRadius: "0 3px 3px 0",
                                    }}
                                    options={[
                                      {
                                        label: "Choose field",
                                        value: "",
                                        disabled: true,
                                      },
                                      ...(() => {
                                        let selected;
                                        let type = _get(v, `type`);
                                        if (!type) return [];
                                        switch (type) {
                                          case "dataSource":
                                            selected = dataSources.find(
                                              (d) =>
                                                d._id ===
                                                values["widgetSeries"][i]["id"]
                                            );
                                            break;
                                          case "device":
                                          default:
                                            selected = devices.find(
                                              (d) =>
                                                d._id ===
                                                values["widgetSeries"][i]["id"]
                                            );
                                        }
                                        if (typeof selected === "undefined")
                                          return [];
                                        let fields = selected.fields;
                                        return [
                                          ...fields.map((field) => {
                                            let disabled = false;
                                            if (
                                              GRAPH_CONFIG[
                                                values["widgetType"]
                                              ]["acceptedType"].indexOf(
                                                field.type
                                              ) === -1
                                            ) {
                                              disabled = true;
                                            }
                                            return {
                                              label: field.name,
                                              value: field._id,
                                              disabled,
                                            };
                                          }),
                                        ];
                                      })(),
                                    ]}
                                    value={v.field}
                                    disabled={v.device === ""}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                  />
                                </Box>
                              )}
                            </Flex>
                            <Button
                              minimal
                              icon="trash"
                              intent={
                                i === values.widgetSeries.length - 1
                                  ? null
                                  : "danger"
                              }
                              onClick={() => arr.remove(i)}
                              disabled={i === values.widgetSeries.length - 1}
                            />
                          </div>
                        ))}
                      </FormGroup>
                    )}
                  />
                )}
              {typeof GRAPH_OPTIONS[values["widgetType"]] !== "undefined" && (
                <Flex alignItems="center" mb={2}>
                  <Box>
                    <Box as="h6" mb={0} className={Classes.HEADING}>
                      <span>Option (experiment) </span>
                      <Icon icon="lab-test" />
                    </Box>
                  </Box>
                  <Box>
                    <Button
                      small={true}
                      minimal={true}
                      icon={optionsIsOpen ? "caret-up" : "caret-down"}
                      onClick={() => setOptionsIsOpen((isOpen) => !isOpen)}
                    />
                  </Box>
                </Flex>
              )}
              <Collapse isOpen={optionsIsOpen}>
                {typeof GRAPH_OPTIONS[values["widgetType"]] !== "undefined" &&
                  Object.keys(GRAPH_OPTIONS[values["widgetType"]]).map(
                    (optionName) => {
                      const type =
                        GRAPH_OPTIONS[values["widgetType"]][optionName];
                      let value = _get(values["widgetOptions"], optionName);
                      if (Array.isArray(type)) {
                        if (!Array.isArray(value)) {
                          value = [""];
                          setFieldValue(`widgetOptions[${optionName}]`, value);
                        }
                        return (
                          <FieldArray
                            key={optionName}
                            name={`widgetOptions[${optionName}]`}
                            render={(arr) => (
                              <FormGroup
                                label={optionName}
                                labelInfo={`(${value.length})`}
                              >
                                {sources.length < value.length && (
                                  <Box mb={2}>
                                    <Button
                                      small
                                      fill
                                      text="Add"
                                      icon="plus"
                                      onClick={() => arr.push("")}
                                    />
                                  </Box>
                                )}
                                {value.map((v, i) => {
                                  const name = `widgetOptions[${optionName}][${i}]`;
                                  return (
                                    <Flex
                                      key={i}
                                      mb={i !== value.length - 1 ? 2 : 0}
                                    >
                                      <Box flexGrow={1}>
                                        <ControlGroup fill>
                                          <SettingsOptions
                                            key={name}
                                            noFormGroup={true}
                                            onChange={(e) => {
                                              handleChange(e);
                                              handleBlur(e);
                                            }}
                                            value={v}
                                            name={name}
                                            label={name}
                                            type={type[0]}
                                          />
                                        </ControlGroup>
                                      </Box>
                                      <Button
                                        minimal
                                        icon="trash"
                                        intent={
                                          i >= value.length ? null : "danger"
                                        }
                                        onClick={() => arr.remove(i)}
                                        disabled={i >= value.length}
                                      />
                                    </Flex>
                                  );
                                })}
                              </FormGroup>
                            )}
                          />
                        );
                      } else {
                        return (
                          <SettingsOptions
                            key={optionName}
                            onChange={(e) => {
                              handleChange(e);
                              handleBlur(e);
                            }}
                            value={value}
                            name={`widgetOptions[${optionName}]`}
                            label={optionName}
                            type={type}
                          />
                        );
                      }
                    }
                  )}
              </Collapse>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button text="Close" minimal intent="danger" onClick={cancel} />
                <Button text="Reset" outlined onClick={handleReset} />
                <Button
                  text="Save"
                  intent="success"
                  loading={isSubmitting}
                  disabled={
                    Object.entries(errors).length > 0 ||
                    Object.entries(touched).length === 0
                  }
                  type="submit"
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default Settings;
