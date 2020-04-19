import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Table as BPTable, Column, Cell } from '@blueprintjs/table';
// import _merge from 'lodash.merge';
import _uniqBy from 'lodash.uniqby';
import WidgetContext from './hocs';
import { FeathersContext } from 'components/feathers';

// const defaultOptions = {}

const Table = ({ series, ...props }) => {
  const widget = useContext(WidgetContext);
  const feathers = useContext(FeathersContext);
  // const options = _merge(defaultOptions, props.options);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const getColumn = useCallback((name, index) => {
    const cellRenderer = (rowIndex, columnIndex) => (<Cell>{data[rowIndex][columnIndex]}</Cell>)
    return (
      <Column
        cellRenderer={cellRenderer}
        key={index}
        name={name} />
    )
  }, [data]);
  useEffect(() => {
    console.log(widget);
    const fetch = async () => {
      const deviceIds = [..._uniqBy(series, 'device').map(v => v.device)];
      let devices = [];
      let dataLake = [];
      let labels = [];
      try {
        devices = await feathers.devices().find({
          query: {
            _id: { $in: deviceIds },
            $select: ['fields', 'name']
          }
        });
        devices = devices.data;
        labels = series.map(s => {
          const device = devices.find(d => d._id === s.device);
          const field = device.fields.find(f => f._id === s.field);
          return {
            deviceId: device._id,
            deviceName: device.name,
            fieldName: field.name,
            fieldIndex: device.fields.indexOf(field)
          }
        });
        setLabels(l => [
          ...l, ...labels
        ])
      } catch (e) { console.log(e); }
      try {
        dataLake = await feathers.dataLake().find({
          query: {
            deviceId: { $in: deviceIds },
            $select: ['data', 'deviceId', 'createdAt']
          }
        });
        dataLake = dataLake.data;
        setData(d => [
          ...d, ...dataLake.map(dl => {
            return labels.map(v => {
              if (v.deviceId !== dl.deviceId) return "";
              return dl.data[v.fieldIndex];
            });
          })
        ])
      } catch (e) {
        console.log(e);
      }
      console.log(devices, dataLake)
    }
    fetch();
  }, [series]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log(labels);
  const columns = labels.map((v, i) => {
    const name = `${v.fieldName} (${v.deviceName})`;
    return getColumn(name, i);
  });
  // const columns = [];
  return (
    <BPTable numRows={data.length}>
      {columns}
    </BPTable>
  )
}

export default Table;