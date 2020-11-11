import React, { useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import { Colors, ResizeSensor } from "@blueprintjs/core";
import { LineChart, Line, XAxis, Tooltip } from "recharts";

export default ({ style, data }) => {
  const [contentSize, setContentSize] = useState({
    height: 100,
    width: 100
  });
  const [latestTime, setLatestTime] = useState(moment().valueOf());
  const [series, setSeries] = useState([]);
  const [options] = useState({
    legend: { show: false },
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    plotOptions: {
      bar: { columnWidth: '5%' },
      dataLabels: { position: 'top' }
    },
    xaxis: { type: "datetime", },
    yaxis: { show: false },
    markers: { size: 5 },
    tooltip: { enabledOnSeries: [1] },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
      offsetY: -8,
      formatter: (v) => {
        let val = moment.duration(v);

        if (val.hours() > 0) return `${val.hours()}h`;

        if (val.minutes() > 0) return `${val.minutes()}m`;

        if (val.seconds() > 0) return `${val.seconds()}s`;

        if (val.milliseconds() > 0) return `${val.milliseconds()}ms`;
      },
      style: { colors: [Colors.BLACK] }
    }
  });
  const parseDuration = useCallback((duration) => {
    let val = moment.duration(duration);
    if (Math.abs(val.hours()) > 0) return `${val.hours()}h`;
    if (Math.abs(val.minutes()) > 0) return `${val.minutes()}m`;
    if (Math.abs(val.seconds()) > 0) return `${val.seconds()}s`;
    if (Math.abs(val.milliseconds()) > 0) return `${val.milliseconds()}ms`;
  }, []);
  useEffect(() => {
    if (data.length === 0) return;
    let dat = data.map((d) => {
      let collectedAt = moment(d.collectedAt).valueOf()
      let x = collectedAt;
      let y = moment(d.createdAt).valueOf() - collectedAt;
      return { x, y };
    })
    setSeries(dat.reverse());
    setLatestTime(moment().valueOf());
  }, [data]);
  return (
    <ResizeSensor onResize={(entries) => {
      entries.forEach(e => setContentSize({ height: e.contentRect.height, width: e.contentRect.width }));
    }}>
      <div style={style}>
        <LineChart height={contentSize.height} width={contentSize.width} data={series}>
          <Line isAnimationActive={false} type="monotone" dataKey="y" stroke="#8884d8" />
          <XAxis dataKey="x" tickFormatter={(tickItem) => {
            return parseDuration(tickItem - latestTime);
          }} />
          <Tooltip labelFormatter={(label) => {
            return moment(label).calendar();
          }} formatter={(value) => {
            return parseDuration(value);
          }} />
        </LineChart>
      </div>
    </ResizeSensor>
  )
}