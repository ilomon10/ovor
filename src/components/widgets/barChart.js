import React, { useContext, useState, useEffect } from 'react';
import { FeathersContext } from 'components/feathers';
import BaseBarChart from './baseBarChart';
import _uniqBy from 'lodash.uniqby';
import moment from 'moment';
import { fetchData } from 'components/widgets/helper';

export const barChartConfig = {
  acceptedType: ["number"],
  minSeries: 1,
  seriesEnabled: true
}

const BarChart = ({ ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      const { dataSources, devices, dataLake } = await fetchData(
        () => { },
        feathers,
        {},
        props.series
      );

      let Series = props.series.map(s => {
        let ret = {
          ...s,
          data: undefined,
          fieldName: undefined,
          sourceName: undefined,
          name: undefined
        }

        let item;
        switch (s.type) {
          case "dataSource":
            item = dataSources.find(d => d._id === s.id);
            break;
          case "device":
          default:
            item = devices.find(d => d._id === s.id);
        }
        const field = item.fields.find(f => f._id === s.field);

        let data = [];
        if (s.type === "dataSource") {
          data = dataLake
            .filter(dl => (dl.dataSourceId === item._id))
            .map(dl => [dl.createdAt, dl.data[field._id]]);
        }

        ret.data = data;
        ret.fieldName = field.name;
        ret.name = `${field.name} (${item.name})`;
        ret.sourceName = item.name;

        return ret;
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
          s.data.push([e.createdAt, e.data[s.fieldName]]);
          return s;
        })
      ])
    }
    feathers.dataLake.on('created', onDataCreated);
    return () => { // Cleanup
      feathers.dataLake.removeListener('created', onDataCreated);
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