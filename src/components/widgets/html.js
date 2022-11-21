import { useFeathers } from "components/feathers";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchData } from "./helper";
import _get from "lodash.get";
import DOMPurify from "dompurify";

const sanitizeOptions = {
  disallowedTagsMode: [""],
};

export const htmlOptions = {
  sourceCode: {
    type: "codeEditor",
  },
};

export const htmlConfig = {
  acceptedType: ["number", "string"],
  minSeries: 1,
  seriesEnabled: true,
};

const HTMLWidget = ({ onError, ...props }) => {
  const feathers = useFeathers();
  const [series, setSeries] = useState([]);
  const [error, setError] = useState();

  const onErr = useCallback(
    (e) => {
      if (typeof onError === "function") onError(e);
      setError(e);
    },
    [onError]
  );

  const sourceCode = useMemo(() => {
    return DOMPurify.sanitize(props.options.sourceCode);
  }, [props.options.sourceCode]);

  useEffect(() => {
    const fetch = async () => {
      let query = {
        $limit: 100,
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
          case "device":
            item = devices.find((d) => d._id === s.id);
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
  }, [props.timeRange]);

  useEffect(() => {
    if (props.timeRange) return;
    const onDataCreated = (e) => {
      setSeries((series) => [
        ...series.map((s) => {
          if (s.type !== "dataSource") return s;
          if (s.dataSource !== e.deviceSourceId) return s;
          s.data.push([e.timestamp, e.data[s.fieldName]]);
          return s;
        }),
      ]);
    };
    const onDeviceOutcoming = (e) => {
      setSeries((series) => [
        ...series.map((s) => {
          if (s.type !== "device") return s;
          if (s.id !== e._deviceId) return s;
          s.data.push([e.timestamp, e[s.fieldName]]);
          return s;
        }),
      ]);
    };
    feathers.hub.on("device-outcoming", onDeviceOutcoming);
    feathers.dataLake.on("created", onDataCreated);
    return () => {
      feathers.hub.removeListener("device-outcoming", onDeviceOutcoming);
      feathers.dataLake.removeListener("created", onDataCreated);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const processed = useMemo(() => {
    let string = sourceCode;
    console.log(series);
    series.forEach((s) => {
      if (s.data.length === 0) return;
      string = string.replaceAll(
        `{{{${s.sourceName}.${s.fieldName}}}}`,
        s.data[s.data.length - 1][1]
      );
    });
    console.log(string);
    return string;
  }, [series]);

  return <div dangerouslySetInnerHTML={{ __html: processed }}></div>;
};

export default HTMLWidget;
