import React, { useCallback, useEffect, useState } from "react";
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
  const parseDuration = useCallback((duration) => {
    let val = moment.duration(duration);
    if (Math.abs(val.hours()) > 0) return `${val.hours()}h`;
    if (Math.abs(val.minutes()) > 0) return `${val.minutes()}m`;
    if (Math.abs(val.seconds()) > 0) return `${val.seconds()}s`;
    if (Math.abs(val.milliseconds()) > 0) return `${val.milliseconds()}ms`;
  }, []);
  useEffect(() => {
    const intervalFunc = setInterval(() => {
      setLatestTime(moment().valueOf());
    }, 5000);
    return () => {
      clearInterval(intervalFunc);
    }
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
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
          />
          <XAxis
            type="number"
            domain={[moment(latestTime).subtract(1, 'h').valueOf(), latestTime]}
            dataKey="x"
            tickFormatter={(tickItem) => {
              let result = parseDuration(tickItem - latestTime);
              if (result) return result;
              return `now`;
            }}
          />
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