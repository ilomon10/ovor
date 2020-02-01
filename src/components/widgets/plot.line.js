import React from 'react';
import Chart from 'react-apexcharts';

// [x, y]

const PlotLine = ({ series, options }) => {
  return (
    <Chart options={options} series={series} type="line" height="100%" width="100%" />
  );
}

export default PlotLine;