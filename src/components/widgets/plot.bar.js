import React from 'react';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';

const PlotBar = ({ series, ...props }) => {
  return (
    <FlexibleXYPlot
      xType="time">
      <XAxis />
      <YAxis />
      {series.map((v, i) => {
        let data = v.data.map((z) => ({ x: z[0], y: z[1] }));
        return (
          <VerticalBarSeries key={i} data={data} />
        )
      })}
    </FlexibleXYPlot>
  );
}

export default PlotBar;