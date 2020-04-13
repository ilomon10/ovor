import React from 'react';
import Chart from 'react-apexcharts';
import _merge from 'lodash.merge';

// [x, y]

const defaultOptions = {
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    labels: {
      formatter: (v) => (v.toFixed(2))
    }
  },
}

const Timeseries = ({ series, ...props }) => {
  const options = _merge(defaultOptions, props.options);
  return (
    <Chart options={options} series={series} type="line" height="100%" width="100%" />
  );
}

export default Timeseries;