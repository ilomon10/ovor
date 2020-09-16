import React, { useContext, useEffect, useState } from 'react';
import _uniqBy from 'lodash.uniqby';
import { FeathersContext } from 'components/feathers';
import BaseNumeric from './baseNumeric';
import moment from 'moment';

const Numeric = ({ ...props }) => {
  const feathers = useContext(FeathersContext);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)];
      const devices = await feathers.devices.find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      })
      let query = {
        $aggregate: 'deviceId',
        deviceId: { $in: deviceIds },
        $select: ['data', 'deviceId'],
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
      const dataLake = await feathers.dataLake.find({ query });
      const Series = props.series.map(s => {
        const device = devices.data.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        let data = dataLake.data.filter(dl => (dl.deviceId === device._id));
        if (typeof data[0] !== 'undefined')
          data = data[0].data[field.name];
        else
          data = undefined;

        return {
          ...s, data,
          fieldName: field.name,
          deviceName: device.name,
          name: field.name
        }
      })
      setLabels(Series.map(s => s.fieldName));
      setSeries(Series);
    }
    fetch();
  }, [props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (props.timeRange) return;
    const onDataCreated = (e) => {
      setSeries(series => ([
        ...series.map(s => {
          if (s.device !== e.deviceId) return s;
          if (typeof e.data[s.fieldName] === 'undefined') return s;
          s.data = e.data[s.fieldName];
          return s;
        })
      ]))
    }
    feathers.dataLake.on('created', onDataCreated);
    return () => {
      feathers.dataLake.removeListener('created', onDataCreated);
    }
  }, [props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <BaseNumeric
      options={{
        ...props.options,
        labels
      }}
      series={series.map(s => s.data)} />
  )
}

export default Numeric;