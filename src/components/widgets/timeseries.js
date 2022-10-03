import React, { useEffect, useContext, useState, useCallback } from "react";
import moment from "moment";
import { NonIdealState } from "@blueprintjs/core";
import { FeathersContext } from "components/feathers";
import BaseTimeseries from "./baseTimeseries";
import { fetchData } from "components/widgets/helper";

export const timeseriesOptions = {
  "stroke.width": { type: "number" },
  "yaxis.max": { type: "number" },
  "yaxis.min": { type: "number" },
  colors: [{ type: "string" }],
  "stroke.colors": [{ type: "string" }],
  "stroke.curve": {
    type: "oneOf",
    options: ["smooth", "straight", "stepline"],
  },
};

export const timeseriesConfig = {
  acceptedType: ["number"],
  minSeries: 1,
  seriesEnabled: true,
};

const Timeseries = ({ onError, ...props }) => {
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState();

  const onErr = useCallback(
    (e) => {
      if (typeof onError === "function") onError(e);
      setError(e);
    },
    [onError]
  );

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      let query = {
        $limit: 1000,
      };

      if (props.timeRange) {
        query = {
          ...query,
          createdAt: {
            $gte: moment(props.timeRange[0]).toISOString(),
            $lte: moment(props.timeRange[1]).toISOString(),
          },
        };
      }

      const { dataSources, devices, dataLake } = await fetchData(
        onErr,
        feathers,
        query,
        props.series
      );

      let Series = props.series.map((s) => {
        let ret = {
          ...s,
          data: undefined,
          fieldName: undefined,
          sourceName: undefined,
          name: undefined,
        };
        let item;
        switch (s.type) {
          case "dataSource":
            item = dataSources.find((d) => d._id === s.id);
            break;
          case "device":
          default:
            item = devices.find((d) => d._id === s.id);
        }
        const field = item.fields.find((f) => f._id === s.field);

        let data = [];
        if (s.type === "dataSource") {
          data = dataLake
            .filter((dl) => dl.dataSourceId === item._id)
            .map((dl) => [dl.createdAt, dl.data[field._id]]);
        }

        ret.data = data;
        ret.fieldName = field.name;
        ret.name = `${field.name} (${item.name})`;
        ret.sourceName = item.name;

        return ret;
      });
      setSeries([...Series]);
    };
    fetch();
  }, [props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.timeRange) return;
    const onDataCreated = (e) => {
      setSeries((d) => [
        ...series.map((s) => {
          if(s.type !== "dataSource") return s;
          if (s.dataSource !== e.dataSourceId) return s;

          let val = e.data[s.fieldName];
          if (val === true) val = 1;
          else if (val === false) val = 0;
          else if (val === undefined) val = null;

          s.data.push([e.createdAt, val]);
          return s;
        }),
      ]);
    };
    const onDeviceOutcoming = (e) => {
      setSeries((d) => [
        ...series.map((s) => {
          if(s.type !== "device") return s;
          if (s.id !== e._deviceId) return s;

          let val = e[s.fieldName];
          if (val === true) val = 1;
          else if (val === false) val = 0;
          else if (val === undefined) val = null;

          s.data.push([e.timestamp, val]);
          return s;
        }),
      ]);
    };
    feathers.hub.on("device-outcoming", onDeviceOutcoming);
    feathers.dataLake.on("created", onDataCreated);
    return () => {
      // Cleanup
      feathers.hub.removeListener("device-outcoming", onDeviceOutcoming);
      feathers.dataLake.removeListener("created", onDataCreated);
    };
  }, [series, props.timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <NonIdealState
        icon="graph-remove"
        title="Error"
        description={
          <>
            <p>{error.message}</p>
          </>
        }
      />
    );
  }

  return (
    <BaseTimeseries
      type="line"
      height="100%"
      width="100%"
      options={props.options}
      series={series.map((s) => ({
        name: s.name,
        data: [...s.data],
      }))}
    />
  );
};

export default Timeseries;
