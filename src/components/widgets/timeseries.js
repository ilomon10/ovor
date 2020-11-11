import React, { useEffect, useContext, useState } from 'react';
import moment from 'moment';
import _uniqBy from 'lodash.uniqby';
import { FeathersContext } from 'components/feathers';
import BaseTimeseries from './baseTimeseries';
import { NonIdealState } from '@blueprintjs/core';

export const timeseriesOptions = {
  "stroke.width": { type: "number" },
  "yaxis.max": { type: "number" },
  "yaxis.min": { type: "number" },
  colors: [{ type: "string" }],
  "stroke.colors": [{ type: "string" }],
  "stroke.curve": {
    type: "oneOf",
    options: ["smooth", "straight", "stepline"]
  },
}

export const timeseriesConfig = {
  acceptedType: ["number"],
  minSeries: 1
}

const Timeseries = ({ onError, ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);
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
            $select: ['fields', 'name']
          }
        });
        devices = data;
      } catch (e) {
        if (typeof onError === 'function') onError(e);
        setError(e);
        return;
      }

      if (devices) {
        props.series.forEach((v, i) => {
          if (!devices.find((d) => d._id === v.device)) {
            let error = new Error(`Device "${v.device}" at series ${i + 1} not found`);
            if (typeof onError === 'function') onError(error);
            setError(error);
            return;
          }
        });
      }

      let query = {
        $limit: 2000,
        deviceId: { $in: deviceIds },
        $sort: {
          createdAt: 1
        },
        $select: ['data', 'deviceId', 'createdAt']
      }
      if (props.timeRange) {
        query = {
          ...query,
          createdAt: {
            $gte: moment(props.timeRange[0]).toISOString(),
            $lte: moment(props.timeRange[1]).toISOString()
          },
        }
      }
      let dataLake = [];
      try {
        let { data } = await feathers.dataLake.find({ query });
        dataLake = data;
      } catch (e) {
        if (typeof onError === 'function') onError(e);
        setError(e);
        return;
      }
      let Series = props.series.map(s => {
        const device = devices.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        const data = dataLake
          .filter(dl => dl.deviceId === device._id)
          .map(dl => {
            let val = dl.data[field.name];
            if (val === true) val = 1;
            else if (val === false) val = 0;
            else if (val === undefined) val = null;
            return [dl.createdAt, val];
          });

        return {
          ...s, fieldName: field.name, data,
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

          let val = e.data[s.fieldName];
          if (val === true) val = 1;
          else if (val === false) val = 0;
          else if (val === undefined) val = null;

          s.data.push([e.createdAt, val]);
          return s;
        })
      ])
    }
    feathers.dataLake.on('created', onDataCreated);
    return () => { // Cleanup
      feathers.dataLake.removeListener('created', onDataCreated);
    }
  }, [series, props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <NonIdealState
        icon="graph-remove"
        title="Error"
        description={<>
          <p>{error.message}</p>
        </>} />
    )
  }

  return (
    <BaseTimeseries type="line" height="100%" width="100%"
      options={props.options}
      series={series.map(s => ({
        name: s.name,
        data: [...s.data]
      }))} />
  );
}

export default Timeseries;