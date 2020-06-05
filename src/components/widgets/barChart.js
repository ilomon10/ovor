import React, { useContext, useState, useEffect } from 'react';
import { FeathersContext } from 'components/feathers';
import BaseBarChart from './baseBarChart';
import _uniqBy from 'lodash.uniqby';
import moment from 'moment';

// [x, y]

const BarChart = ({ ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);

  // Component Did Mount

  useEffect(() => {
    const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)]
    const fetch = async () => {
      let devices = (await feathers.devices().find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      })).data;
      let query = {
        $limit: 100,
        deviceId: { $in: deviceIds },
        $select: ['data', 'deviceId', 'createdAt']
      }
      if (props.timeRange) {
        query = {
          ...query,
          createAt: {
            $gte: moment(props.timeRange[0]).toISOString(),
            $lte: moment(props.timeRange[1]).toISOString()
          }
        }
      }
      let dataLake = (await feathers.dataLake().find({ query })).data;
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
  }, [props.timeRange]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.timeRange) return;
    const onDataCreated = (e) => {
      setSeries(d => [
        ...series.map(s => {
          if (s.device !== e.deviceId) return s;
          s.data.push([e.createdAt, e.data[s.fieldIndex]]);
          return s;
        })
      ])
    }
    feathers.dataLake().on('created', onDataCreated);
    return () => { // Cleanup
      feathers.dataLake().removeListener('created', onDataCreated);
    }
  }, [series, props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseBarChart type='bar' height="100%" width="100%"
      options={props.options}
      series={series.map(s => ({
        name: s.name,
        data: [...s.data]
      }))} />
  );
}

export default BarChart;