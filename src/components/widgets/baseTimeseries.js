import React from 'react';
import Chart from 'react-apexcharts';
import _merge from 'lodash.merge';
import _get from 'lodash.get';

// [x, y]

const defaultOptions = {
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0
  },
  colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
  chart: {
    sparkline: { enabled: false, },
  },
  xaxis: {
    show: true,
    type: 'datetime'
  },
  yaxis: {
    labels: {
      formatter: (v) => (typeof v === 'number' ? v.toFixed(2) : 0)
    }
  },
}

const BaseTimeseries = ({ series, ...props }) => {
  const options = _merge({}, defaultOptions, props.options);
  if(options.stroke.colors && _get(options, "stroke.colors").length === 0) options.stroke.colors = undefined;
  return (
    <Chart options={options} series={series} type="line" height="100%" width="100%" />
  );
}

export default BaseTimeseries;;