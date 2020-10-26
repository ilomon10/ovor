import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import _uniqBy from 'lodash.uniqby';
import BasePieChart from 'components/widgets/basePieChart';
import { FeathersContext } from 'components/feathers';

export const pieChartOptions = {
  colors: [{ type: "string" }],
  "dataLabels.enabled": { type: "boolean" }
}

export const pieChartConfig = {
  minSeries: 2,
  acceptedType: ["number"]
}

export default ({ onError, ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState();

  // Component Did Mount
  useEffect(() => {
    const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)];
    const fetch = async () => {
      let devices = [];
      try {
        let { data } = await feathers.devices.find({
          query: {
            _id: { $in: deviceIds },
            $select: ["fields", "name"]
          }
        })
        devices = data;
      } catch (e) {
        if (typeof onError === "function") onError(e);
        setError(e);
        return;
      }

      if (devices) {
        props.series.forEach((v, i) => {
          if (devices.find((d) => d._id === v.device)) {
            let error = new Error(`Device "${v.device}" at series ${i + 1} not found`);
            if (typeof onError === "function") onError(error);
            setError(error);
            return;
          }
        });
      }
      let query = {
        $limit: 1,
        deviceId: { $in: deviceIds },
        $sort: {
          createdAt: -1
        },
        $select: ["data", "deviceId"]
      }
      if (props.timeRange) {
        query = {
          ...query,
          createdAt: {
            $gte: moment(props.timeRange[0]).toISOString(),
            $lte: moment(props.timeRange[1]).toISOString()
          }
        }
      }
      let dataLake = [];
      try {
        let { data } = await feathers.dataLake.find({ query });
        dataLake = data;
      } catch (e) {
        if (typeof onError === "function") onError(e);
        setError(e);
        return;
      }

      let Labels = [];
      let Series = [];
      props.series.forEach(s => {
        const device = devices.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        const data = dataLake
          .filter(dl => dl.deviceId === device._id)
          .map(dl => dl.data[field.name]);
        Series.push(data[0]);
        Labels.push({
          deviceId: device._id,
          deviceName: device.name,
          fieldName: field.name
        });
      })
      setSeries(Series);
      setLabels(Labels);
    }
    fetch();
  }, []);

  return (
    <BasePieChart type="pie" height="100%" width="100%"
      options={{
        ...props.options,
        labels: labels.map((v, i) => {
          let name = `${v.fieldName} (${v.deviceName})`;
          return name;
        })
      }}
      series={series} />
  )
}