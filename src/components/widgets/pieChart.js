import React from 'react';
import Chart from 'react-apexcharts';
import _marge from 'lodash.merge';

const defaultOptions = {}

const PieChart = ({ series, ...props }) => {
  const options = _marge(defaultOptions, props.options);
  return (
    <Chart type="pie" series={series} options={options} height={"100%"} width={"100%"} />
  );
}

export default PieChart;