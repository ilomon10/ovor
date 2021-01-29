import React from "react";
import * as Yup from "yup";
import { GRAPH_CONFIG } from 'components/widgets/constants';
import { Box } from "components/utility/grid";

const Schema = Yup.object().shape({
  widgetTitle: Yup.string()
    .min(3, "Too Short!")
    .max(36, "Too Long!")
    .required('Fill this field'),
  widgetType: Yup.string()
    .notOneOf(['empty'], 'Cant be empty'),
  widgetOption: Yup.mixed(),
  widgetSeries: Yup.array()
    .when("widgetType", {
      is: (value) => (GRAPH_CONFIG[value] && GRAPH_CONFIG[value]["seriesEnabled"]),
      otherwise: Yup.array(),
      then: Yup.array()
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
})

const Settings = ({ schema, data }) => {
  console.log(Schema);
  return (
    <Box>
      Settings
    </Box>
  )
}

export default Settings;