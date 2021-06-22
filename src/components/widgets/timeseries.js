import React, { useEffect, useContext, useState, useCallback } from 'react';
import moment from 'moment';
import _uniqBy from 'lodash.uniqby';
import _sortBy from 'lodash.sortby';
import { NonIdealState } from '@blueprintjs/core';
import { FeathersContext } from 'components/feathers';
import BaseTimeseries from './baseTimeseries';

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
  minSeries: 1,
  seriesEnabled: true
}

const Timeseries = ({ onError, ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState();

  const onErr = useCallback((e) => {
    if (typeof onError === 'function') onError(e);
    setError(e);
  }, [onError]);

  // Component Did Mount
  useEffect(() => {
    const dataSourceIds = [..._uniqBy(props.series, 'dataSource').map(v => v.dataSource)];
    const fetch = async () => {
      let dataSources = [];
      try {
        let { data } = await feathers.dataSources.find({
          query: {
            _id: { $in: dataSourceIds },
            $select: ["_id", 'fields', 'name']
          }
        });
        dataSources = data;
      } catch (e) {
        onErr(e);
        return;
      }

      if (dataSources) {
        props.series.forEach((v, i) => {
          if (!dataSources.find((d) => d._id === v.dataSource)) {
            let error = new Error(`Data Source "${v.dataSource}" at series ${i + 1} not found`);
            onErr(error);
            return;
          }
        });
      }

      let query = {
        $limit: 1000,
        dataSourceId: { $in: dataSourceIds },
        $sort: { createdAt: -1 },
        $select: ["_id", 'data', 'dataSourceId', 'createdAt']
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
        dataLake = _sortBy(data, (d) => d.createdAt);
      } catch (e) {
        onErr(e);
        return;
      }
      let Series = props.series.map(s => {
        const dataSource = dataSources.find(d => d._id === s.dataSource);
        const field = dataSource.fields.find(f => f._id === s.field);
        const data = dataLake
          .filter(dl => dl.dataSourceId === dataSource._id)
          .map(dl => {
            let val = dl.data[field.name];
            if (val === true) val = 1;
            else if (val === false) val = 0;
            else if (val === undefined) val = null;
            return [dl.createdAt, val];
          });

        return {
          ...s, fieldName: field.name, data,
          name: `${field.name} (${dataSource.name})`
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
          if (s.dataSource !== e.dataSourceId) return s;

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