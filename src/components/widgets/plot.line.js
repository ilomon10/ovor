import React from 'react';
import { FlexibleXYPlot, LineSeries, XAxis, YAxis } from 'react-vis';

const PlotLine = ({ series, ...props }) => {
  return (
    <FlexibleXYPlot
      xType="time">
      <XAxis />
      <YAxis />
      {series.map((v, i) => {
        const data = v.data.map((z) => ({ x: z[0], y: z[1] }))
        // console.log(data);
        return (
          <LineSeries key={i} data={data} />
        )
      })}
    </FlexibleXYPlot>
  );
}

export default PlotLine;