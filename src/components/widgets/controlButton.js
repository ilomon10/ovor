import React, { useContext, useState, useEffect, useCallback } from "react";
import { Button, NonIdealState } from "@blueprintjs/core";
import { FeathersContext } from "components/feathers";
import _merge from "lodash.merge";
import _get from "lodash.get";
import _isEmpty from "lodash/isEmpty";
import { Box } from "components/utility/grid";
import { fetchData } from "components/widgets/helper";
import moment from "moment";

export const buttonOptions = {
  iconName: {
    type: "oneOf",
    options: ["blank", "asterisk", "lightbulb", "dot", "full-circle"],
  },
  direction: {
    type: "oneOf",
    options: ["vertical", "horizontal"],
  },
  "state.on.label": [{ type: "string" }],
  "state.off.label": [{ type: "string" }],
};

export const buttonConfig = {
  maxSeries: 3,
  acceptedType: ["boolean"],
  seriesEnabled: true,
};

const defaultOptions = {
  iconName: "",
  direction: "vertical",
};

const ControlButton = ({ onError, ...props }) => {
  const feathers = useContext(FeathersContext);
  const options = _merge(defaultOptions, props.options);
  const [isLoading, setIsLoading] = useState(false);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState();

  const onErr = useCallback(
    (e) => {
      if (typeof onError === "function") onError(e);
      setError(e);
    },
    [onError]
  );

  useEffect(() => {
    const fetch = async () => {
      let query = {
        $limit: 1,
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
          deviceName: undefined,
          name: undefined,
        };
        let item;
        switch (s.type) {
          case "dataSource":
            item = dataSources.find((d) => d._id === s.id);
            break;
          case "device":
            item = devices.find((d) => d._id === s.id);
            break;
          default:
            break;
        }

        const field = item.fields.find((f) => f._id === s.field);

        let data = [];
        if (s.type === "dataSource") {
          data = dataLake
            .filter((dl) => dl.dataSourceId === item._id)
            .map((dl) => [dl.createdAt, dl.data[field._id]]);
        }

        if (typeof data[0] !== "undefined") data = data[0].data[field.name];
        else data = false;

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
      setSeries((series) => [
        ...series.map((s) => {
          if (s.device !== e.deviceId) return s;
          if (typeof e.data[s.fieldName] === "undefined") return s;
          s.data = e.data[s.fieldName];
          return s;
        }),
      ]);
    };
    const onDeviceOutcoming = (e) => {
      setSeries((series) => [
        ...series.map((s) => {
          if (s.id !== e._deviceId) return s;
          if (typeof e[s.fieldName] === "undefined") return s;
          s.data = e[s.fieldName];
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

  const onClick = useCallback(
    (cs) => {
      const push = async () => {
        setIsLoading(true);
        const params = {};
        const data = {
          [cs.fieldName]: !cs.data,
        };
        if (cs.type === "device") {
          params.device = cs.id;
        } else if (cs.type === "dataSource") {
          params.dataSource = cs.id;
        }
        try {
          await feathers.hub.create(data, { query: params });
        } catch (e) {
          console.error(e);
        }
        setIsLoading(false);
      };
      push();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series]
  );

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
    <Box
      width={"100%"}
      height={"100%"}
      p={2}
      className={`flex ${
        options.direction === "vertical" ? "flex--col" : "flex--row"
      }`}
    >
      {series.map((s, i) => (
        <Button
          key={i}
          fill
          className="flex-grow"
          loading={isLoading}
          onClick={() => onClick(s)}
          active={s.data}
          icon={!_isEmpty(options.iconName) && options.iconName}
          text={<ButtonText options={options} series={s} />}
        />
      ))}
    </Box>
  );
};

const ButtonText = ({ options, series }) => {
  let text = `${series.name}`;
  if (series.data) {
    text = _get(options, "state.on.label") || text;
  } else {
    text = _get(options, "state.off.label") || text;
  }
  return <div>{text}</div>;
};

export default ControlButton;
