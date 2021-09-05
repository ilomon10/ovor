import React, { useCallback, useEffect, useState, useContext } from "react";
import moment from "moment";
import { ResizeSensor } from "@blueprintjs/core";
import { LineChart, Line, XAxis, Tooltip } from "recharts";
import { FeathersContext } from 'components/feathers';

export default ({ style }) => {
  const feathers = useContext(FeathersContext);
  const [data, setData] = useState([]);
  const [contentSize, setContentSize] = useState({
    height: 100,
    width: 100
  });
  const [latestTime, setLatestTime] = useState(moment().valueOf());
  const [series, setSeries] = useState([]);
  const parseDuration = useCallback((duration) => {
    let val = moment.duration(duration);
    if (Math.abs(val.years()) > 0) return `${val.years()}yr`;
    if (Math.abs(val.months()) > 0) return `${val.months()}mth`;
    if (Math.abs(val.days()) > 0) return `${val.days()}d`;
    if (Math.abs(val.hours()) > 0) return `${val.hours()}hr`;
    if (Math.abs(val.minutes()) > 0) return `${val.minutes()}min`;
    if (Math.abs(val.seconds()) > 0) return `${val.seconds()}s`;
    if (Math.abs(val.milliseconds()) > 0) return `${val.milliseconds()}ms`;
  }, []);

  // Component Did Mount
  useEffect(() => {
    console.log("hub init");
    const onHubCreated = (e) => {
      let d = { ...e };
      setData(data => ([
        ...data,
        {
          timestamp: d["_timestamp"],
          size: d["_memSize"]
        }
      ]))
    }
    feathers.hub.on('created', onHubCreated);
    return () => {
      feathers.hub.removeListener('created', onHubCreated);
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      let x = moment(d["timestamp"]).valueOf();
      let y = d["size"];
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
            name="Tx"
            stroke="#8884d8"
          />
          <XAxis
            type="number"
            domain={[moment(latestTime).subtract(1, 'h').valueOf(), latestTime]}
            dataKey="x"
            tickFormatter={(tickItem) => {
              let result = parseDuration(tickItem - latestTime);
              if (result) return result;
              const now = moment().format("HH:mm");
              return `now (${now})`;
            }}
          />
          <Tooltip labelFormatter={(label) => {
            return moment(label).calendar();
          }} formatter={(value) => {
            return `${value} byte`;
          }} />
        </LineChart>
      </div>
    </ResizeSensor>
  )
}