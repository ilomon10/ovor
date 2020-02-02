import React from 'react';
import Chart from 'react-apexcharts';

// [angle, radius]

const Radial = ({ series, options }) => {
  return (
    <Chart type="pie" series={series} options={options} height={"100%"} width={"100%"} />
  );
}

export default Radial;