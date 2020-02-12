import React from 'react';
import Chart from 'react-apexcharts';

// 
// Properties
// - Name
// - Field
//   - Title
//   - Color

const PieChart = ({ series, options }) => {
  return (
    <Chart type="pie" series={series} options={options} height={"100%"} width={"100%"} />
  );
}

export default PieChart;