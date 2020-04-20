import React, { useEffect, useContext, useState } from 'react';
import _uniqBy from 'lodash.uniqby';
import { FeathersContext } from 'components/feathers';
import BaseTimeseries from './baseTimeseries';

const Timeseries = ({ ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);

  // Component Did Mount
  useEffect(() => {
    const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)];
    const fetch = async () => {
      let devices = (await feathers.devices().find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      })).data;
      let dataLake = (await feathers.dataLake().find({
        query: {
          $limit: 100,
          deviceId: { $in: deviceIds },
          $select: ['data', 'deviceId', 'createdAt']
        }
      })).data;
      let Series = props.series.map(s => {
        const device = devices.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        const fieldIndex = device.fields.indexOf(field);
        const data = dataLake
          .filter(dl => dl.deviceId === device._id)
          .map(dl => [dl.createdAt, dl.data[fieldIndex]]);
        return {
          ...s, fieldIndex, data,
          name: `${field.name} (${device.name})`
        }
      })
      setSeries([...Series]);
    }
    fetch();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <BaseTimeseries type="line" height="100%" width="100%"
      options={props.options}
      series={series.map(s =>({
        name: s.name,
        data: s.data
      }))} />
  );
}

export default Timeseries;