import React from 'react';
import Chart from 'react-apexcharts';
import _marge from 'lodash.merge';

const defaultOptions = {
  dataLabels: {
    enabled: true
  },
  legend: {
    show: true
  }
}

const BasePieChart = ({ series, ...props }) => {
  const options = _marge({}, defaultOptions, props.options);
  return (
    <Chart type="pie" series={series} options={options} height={"100%"} width={"100%"} />
  );
}

export default BasePieChart;