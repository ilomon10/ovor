import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import _uniqBy from 'lodash.uniqby';
import { FeathersContext } from 'components/feathers';
import BaseTable from './baseTable';

export const tableConfig = {
  acceptedType: ["number", "boolean", "date"]
}

const Table = ({ series, ...props }) => {
  const feathers = useContext(FeathersContext);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      const deviceIds = [..._uniqBy(series, 'device').map(v => v.device)];
      let devices = [];
      let dataLake = [];
      let Labels = [];
      devices = await feathers.devices.find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      });
      devices = devices.data;
      Labels = ['timestamp', ...series.map(s => {
        const device = devices.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        return {
          deviceId: device._id,
          deviceName: device.name,
          fieldName: field.name
        }
      })];
      setLabels([...Labels])

      let query = {
        $limit: 100,
        deviceId: { $in: deviceIds },
        $select: ['data', 'deviceId', 'createdAt']
      };

      if (props.timeRange) {
        query = {
          ...query,
          createdAt: {
            $gte: moment(props.timeRange[0]).toISOString(),
            $lte: moment(props.timeRange[1]).toISOString()
          },
        }
      }

      dataLake = await feathers.dataLake.find({ query });
      dataLake = dataLake.data;
      setData(() => [
        ...dataLake.map(dl => {
          return Labels.map((v, i) => {
            if (i === 0) return moment(dl.createdAt).calendar();
            if (v.deviceId !== dl.deviceId) return "";
            if (typeof dl.data[v.fieldName] === 'undefined') return '';
            return String(dl.data[v.fieldName]);
          });
        })
      ])
    }
    fetch();
  }, [props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.timeRange) return;
    const onDataCreated = (e) => {
      let isOk = false;
      const ret = labels.map((v, i) => {
        if (i === 0) return moment(e.createdAt).calendar();
        if (v.deviceId !== e.deviceId) return "";
        isOk = true;
        return String(e.data[v.fieldName]);
      })
      if (!isOk) return;
      setData(d => [
        ...d, ret
      ])
    }
    feathers.dataLake.on('created', onDataCreated);
    return () => { // Cleanup
      feathers.dataLake.removeListener('created', onDataCreated);
    }
  }, [labels, props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseTable series={data} options={{
      ...props.options,
      labels: labels.map((v, i) => {
        let name = v;
        if (i !== 0) name = {
          title: v.fieldName,
          subtitle: v.deviceName
        }
        return name;
      })
    }} />
  )
}

export default Table;