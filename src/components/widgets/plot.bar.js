import React from 'react';
import Chart from 'react-apexcharts';

// [x, y]

const PlotBar = ({ series, options }) => {
  return (
    <Chart options={options} series={series} type='bar' height="100%" width="100%"/>
  );
}

export default PlotBar;