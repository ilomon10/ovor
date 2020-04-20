import React, { useContext, useEffect, useState } from 'react';
import _uniqBy from 'lodash.uniqby';
import { FeathersContext } from 'components/feathers';
import BaseTable from './baseTable';

const Table = ({ series, ...props }) => {
  const feathers = useContext(FeathersContext);
  const [labels, setLabels] = useState(['timestamp']);
  const [data, setData] = useState([]);

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      const deviceIds = [..._uniqBy(series, 'device').map(v => v.device)];
      let devices = [];
      let dataLake = [];
      let Labels = [];
      devices = await feathers.devices().find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      });
      devices = devices.data;
      Labels = [...labels, ...series.map(s => {
        const device = devices.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        return {
          deviceId: device._id,
          deviceName: device.name,
          fieldName: field.name,
          fieldIndex: device.fields.indexOf(field)
        }
      })];
      setLabels([...Labels])

      dataLake = await feathers.dataLake().find({
        query: {
          deviceId: { $in: deviceIds },
          $select: ['data', 'deviceId', 'createdAt']
        }
      });
      dataLake = dataLake.data;
      setData(d => [
        ...d, ...dataLake.map(dl => {
          return Labels.map((v, i) => {
            if (i === 0) return dl.createdAt;
            if (v.deviceId !== dl.deviceId) return "";
            return dl.data[v.fieldIndex];
          });
        })
      ])
    }
    fetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onDataCreated = (e) => {
      setData(d => [
        ...d, labels.map((v, i) => {
          if (i === 0) return e.createdAt;
          if (v.deviceId !== e.deviceId) return "";
          return e.data[v.fieldIndex];
        })
      ])
    }
    feathers.dataLake().on('created', onDataCreated);
    return () => { // Cleanup
      feathers.dataLake().removeListener('created', onDataCreated);
    }
  }, [labels]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseTable series={data} options={{
      ...props.options,
      labels: labels.map((v, i) => {
        let name = v;
        if (i !== 0) name = `${v.fieldName} (${v.deviceName})`;
        return name;
      })
    }} />
  )
}

export default Table;