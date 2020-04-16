import React, { useCallback, useContext } from 'react';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Classes, FormGroup, ControlGroup, InputGroup, HTMLSelect, Button } from '@blueprintjs/core';
import { GRAPH_TYPE } from './constants';
import DashboardContext from 'components/hocs/dashboard';
import { MosaicContext } from 'react-mosaic-component';
import WidgetContext from './hocs';

const Schema = Yup.object().shape({
  widgetTitle: Yup.string()
    .min(3, "Too Short!")
    .max(36, "Too Long!")
    .required('Fill this field'),
  widgetType: Yup.string()
    .required('Choose widget type'),
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
  const dashboardCtx = useContext(DashboardContext);
  const widgetCtx = useContext(WidgetContext);
  const widget = dashboardCtx.getWidget(widgetCtx.tileId);
  console.log(dashboardCtx);
  console.log(widget);
  const cancle = useCallback(() => {
    onClose();
  }, [onClose])
  return (
    <Formik
      initialValues={{
        'widgetTitle': widget.title,
        'widgetType': widget.type,
        'widgetSeries': [
          { device: "", field: "" }
        ]
      }}
      validationSchema={Schema}
      onSubmit={(values) => console.log(values)}>
      {({ values, errors, handleChange, handleSubmit, isSubmitting, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={Classes.DIALOG_BODY}>
              <FormGroup
                label="Title"
                labelInfo="(required)"
                intent={errors.widgetTitle ? "danger" : "none"}
                helperText={errors.widgetTitle}>
                <InputGroup type="text" name="widgetTitle" value={values["widgetTitle"]}
                  intent={errors.widgetTitle ? "danger" : "none"}
                  onChange={handleChange} />
              </FormGroup>
              <FormGroup
                label="Type"
                intent={errors.widgetType ? "danger" : "none"}
                helperText={errors.widgetType}>
                <HTMLSelect fill name="widgetType"
                  value={values.widgetType}
                  intent={errors.widgetType ? "danger" : "none"}
                  options={Object.keys(GRAPH_TYPE)
                    .map((v) => ({ label: v, value: GRAPH_TYPE[v] }))}
                  onChange={handleChange} />
              </FormGroup>
              <FieldArray
                name="widgetSeries"
                render={
                  arr => (
                    <FormGroup
                      label="Series"
                      labelInfo={`(${values.widgetSeries.length - 1})`}
                      intent={errors.widgetSeries ? "danger" : "none"}
                      helperText={errors.widgetSeries}>
                      {values.widgetSeries.map((v, i) => (
                        <div key={i} className="flex" style={{ marginBottom: i !== values.widgetSeries.length - 1 ? 12 : 0 }} >
                          <ControlGroup fill className="flex-grow">
                            <HTMLSelect
                              name={`widgetSeries[${i}].device`}
                              options={[{ label: "Choose device", value: "", disabled: true }, "Sensor Debu", "Sensor Temperature"]}
                              value={v.device}
                              onChange={e => {
                                setFieldValue(`widgetSeries[${i}].field`, '');
                                handleChange(e);
                                if (i === values.widgetSeries.length - 1) arr.push({ device: '', field: '' });
                              }} />
                            <HTMLSelect
                              name={`widgetSeries[${i}].field`}
                              options={[{ label: "Choose field", value: "", disabled: true }, "O2"]}
                              value={v.field}
                              disabled={v.device === ''}
                              onChange={handleChange} />
                          </ControlGroup>
                          <Button minimal icon="trash" intent={i === values.widgetSeries.length - 1 ? null : 'danger'}
                            onClick={() => arr.remove(i)}
                            disabled={i === values.widgetSeries.length - 1} />
                        </div>
                      ))}
                    </FormGroup>
                  )
                } />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button text="Close" minimal intent="danger"
                  onClick={cancle} />
                <Button text="Save" intent="success"
                  loading={isSubmitting}
                  disabled={Object.entries(errors).length > 0}
                  type="submit" />
              </div>
            </div>
          </form>)
      }}
    </Formik >
  )
}

export default Settings;