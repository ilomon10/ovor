import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Classes, Callout, FormGroup, ControlGroup, InputGroup, HTMLSelect, Button, Icon } from '@blueprintjs/core';
import { GRAPH_TYPE, GRAPH_OPTIONS } from './constants';
import DashboardContext from 'components/hocs/dashboard';
import { FeathersContext } from 'components/feathers';
import WidgetContext from './hocs';
import SettingsOptions from './settings.options';

const Schema = Yup.object().shape({
  widgetTitle: Yup.string()
    .min(3, "Too Short!")
    .max(36, "Too Long!")
    .required('Fill this field'),
  widgetType: Yup.string()
    .notOneOf(['empty'], 'Cant be empty'),
  widgetOption: Yup.mixed(),
  widgetSeries: Yup.array()
    .min(2, "Min have 1 series")
    .test('test', 'Please leave no one empty (except last one)', function (value) {
      const scheme = Yup.object().shape({
        device: Yup.string().required('Req'),
        field: Yup.string().required('Req'),
      })
      for (let i = 0; i < value.length - 1; i++) {
        if (!scheme.isValidSync(value[i])) {
          return false;
        }
      }
      return true
    })
})

const Settings = ({ onClose }) => {
  const dashboard = useContext(DashboardContext);
  const feathers = useContext(FeathersContext);
  const widget = useContext(WidgetContext);
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    feathers.devices().find({
      query: { $select: ['name', 'fields'] }
    }).then(e => {
      setDevices([...e.data]);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const cancel = useCallback(() => {
    onClose();
  }, [onClose]);
  return (
    <Formik
      initialValues={{
        'widgetTitle': widget.title,
        'widgetType': widget.type || 'empty',
        'widgetOptions': { ...widget.options },
        'widgetSeries': [
          ...widget.series,
          { device: "", field: "" }
        ]
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        let options = values['widgetOptions'];
        let series = values['widgetSeries'].slice(0, values['widgetSeries'].length - 1);
        try {
          await feathers.dashboards().patch(dashboard.getId(), {
            $set: {
              "widgets.$.options": { ...options },
              "widgets.$.series": [...series],
              "widgets.$.title": values['widgetTitle'],
              "widgets.$.type": values['widgetType']
            }
          }, { query: { "widgets._id": widget.id } });
          onClose();
        } catch (e) {
          setErrors({ submit: e.message });
          setSubmitting(false);
        }
      }}>
      {({ values, errors, handleChange, handleSubmit, handleBlur, handleReset, isSubmitting, setFieldValue, touched }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              {errors.submit &&
                <Callout intent="danger" style={{ marginBottom: 15 }}>
                  {errors.submit}
                </Callout>}
              <FormGroup
                label="Title"
                labelInfo="(required)"
                intent={errors.widgetTitle ? "danger" : "none"}
                helperText={errors.widgetTitle}>
                <InputGroup type="text" name="widgetTitle" value={values["widgetTitle"]}
                  intent={errors.widgetTitle ? "danger" : "none"}
                  onChange={e => {
                    handleChange(e);
                    handleBlur(e);
                  }} />
              </FormGroup>
              <FormGroup
                label="Type"
                intent={errors.widgetType ? "danger" : "none"}
                helperText={errors.widgetType}>
                <HTMLSelect fill name="widgetType"
                  value={values.widgetType}
                  intent={errors.widgetType ? "danger" : "none"}
                  options={[{ label: "Choose widget type", value: "empty", disabled: true }, ...Object.keys(GRAPH_TYPE)
                    .map((v) => ({ label: v, value: GRAPH_TYPE[v] }))]}
                  onChange={e => {
                    handleChange(e);
                    handleBlur(e);
                    setFieldValue(`widgetOptions`, {});
                  }} />
              </FormGroup>
              <FieldArray
                name="widgetSeries"
                render={
                  arr => (<FormGroup
                    label="Series"
                    labelInfo={`(${values.widgetSeries.length - 1})`}
                    intent={errors.widgetSeries ? "danger" : "none"}
                    helperText={errors.widgetSeries}>
                    {values.widgetSeries.map((v, i) => (
                      <div key={i} className="flex" style={{ marginBottom: i !== values.widgetSeries.length - 1 ? 12 : 0 }} >
                        <ControlGroup fill className="flex-grow">
                          <HTMLSelect
                            name={`widgetSeries[${i}].device`}
                            options={[{ label: "Choose device", value: "", disabled: true }, ...devices.map((device) => ({ label: device.name, value: device._id }))]}
                            value={v.device}
                            onBlur={handleBlur}
                            onChange={e => {
                              setFieldValue(`widgetSeries[${i}].field`, '');
                              handleChange(e);
                              if (i === values.widgetSeries.length - 1) arr.push({ device: '', field: '' });
                            }} />
                          <HTMLSelect
                            name={`widgetSeries[${i}].field`}
                            options={[
                              { label: "Choose field", value: "", disabled: true },
                              ...(() => {
                                const deviceSelected = devices.find(device => device._id === values['widgetSeries'][i].device);
                                if (typeof deviceSelected === 'undefined') return [];
                                const fields = deviceSelected.fields;
                                return [...fields.map(field => ({ label: field.name, value: field._id }))];
                              })()]}
                            value={v.field}
                            disabled={v.device === ''}
                            onBlur={handleBlur}
                            onChange={handleChange} />
                        </ControlGroup>
                        <Button minimal icon="trash" intent={i === values.widgetSeries.length - 1 ? null : 'danger'}
                          onClick={() => arr.remove(i)}
                          disabled={i === values.widgetSeries.length - 1} />
                      </div>
                    ))}
                  </FormGroup>)
                } />
              {typeof GRAPH_OPTIONS[values['widgetType']] !== 'undefined' &&
                <h6 className={Classes.HEADING}>
                  <span>Option (experiment) </span>
                  <Icon icon="lab-test" />
                </h6>}
              {typeof GRAPH_OPTIONS[values['widgetType']] !== 'undefined' &&
                Object.keys(GRAPH_OPTIONS[values['widgetType']]).map(optionName => {
                  const type = GRAPH_OPTIONS[values['widgetType']][optionName];
                  return (<SettingsOptions key={optionName}
                    onChange={(e) => {
                      handleChange(e);
                      handleBlur(e);
                    }}
                    value={values['widgetOptions'][optionName]}
                    name={`widgetOptions[${optionName}]`}
                    label={optionName} type={type} />)
                })}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button text="Close" minimal intent="danger"
                  onClick={cancel} />
                <Button text="Reset" outlined
                  onClick={handleReset} />
                <Button text="Save" intent="success"
                  loading={isSubmitting}
                  disabled={Object.entries(errors).length > 0 || Object.entries(touched).length === 0}
                  type="submit" />
              </div>
            </div>
          </form>)
      }}
    </Formik >
  )
}

export default Settings;