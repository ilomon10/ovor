import React, { useState, useEffect, useContext, useCallback } from 'react';
import { InputGroup, Slider as BPSlider, NonIdealState } from '@blueprintjs/core';
import styled from 'styled-components';
import _merge from 'lodash.merge';
import _uniqBy from 'lodash.uniqby';
import _debounce from "lodash.debounce";
import { FeathersContext } from 'components/feathers';
import { Box, Flex } from 'components/utility/grid';

export const sliderOptions = {
  max: { type: 'number' },
  min: { type: 'number' },
  stepSize: { type: 'number' },
  vertical: { type: 'boolean' },
  labelStepSize: { type: 'number' },
}

export const sliderConfig = {
  maxSeries: 1,
  acceptedType: ['number'],
  seriesEnabled: true
}

const defaultOptions = {
  min: 0,
  max: 10,
  stepSize: 0.1,
  labelStepSize: 1
}

const Slider = styled(BPSlider)`
  && {
    height: ${(props) => props.vertical ? "100%" : "inherit"};
  }
`

const Control = ({ onError, ...props }) => {
  const options = _merge(defaultOptions, props.options);
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const onErr = useCallback((e) => {
    if (typeof onError === 'function') onError(e);
    setError(e);
  }, [onError]);

  useEffect(() => {
    const fetch = async () => {
      const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)];

      let devices = [];
      try {
        let { data } = await feathers.devices.find({
          query: {
            _id: { $in: deviceIds },
            $select: ["_id", 'fields', 'name']
          }
        })
        devices = data;
      } catch (e) {
        onErr(e);
        return;
      }

      const query = {
        deviceId: { $in: deviceIds },
        $select: ["_id", 'data', 'deviceId']
      }

      let dataLake = [];
      try {
        let { data } = await feathers.dataLake.find({ query });
        dataLake = data;
      } catch (e) {
        onErr(e);
        return;
      }
      let Series = props.series.map(s => {
        const device = devices.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        let data = dataLake.filter(dl => (dl.deviceId === device._id));
        if (typeof data[0] !== 'undefined')
          data = data[0].data[field.name];
        else
          data = undefined;

        return {
          ...s, data,
          fieldName: field.name,
          deviceName: device.name,
          name: field.name
        }
      })
      setSeries([...Series]);
    }
    fetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const pushData = useCallback(_debounce((cs, series) => {
    const push = async () => {
      setIsLoading(true);
      let data = {};
      series.forEach(s => {
        let res = s.data;
        if (s.device !== cs.device) return;
        if (s.fieldName === cs.fieldName) res = cs.data;
        data[s.fieldName] = res;
      })
      const payload = {
        deviceId: cs.device,
        data
      }
      try {
        await feathers.dataLake.create(payload);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
    push();
  }, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps
  const onRelease = useCallback((cs) => {
    pushData(cs, series);
  }, [pushData, series]); // eslint-disable-line react-hooks/exhaustive-deps
  const onInputChange = useCallback(async (s, i, v) => {
    await setSeries(sr => {
      let val = v.target.value;
      let res = [...sr];
      res[i].data = Number(val);
      return res;
    })
    pushData(s, series);
  }, [pushData, series]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div style={{
      width: '100%', height: '100%',
      padding: options.vertical ? '12px 12px' : '12px 24px'
    }} className={`flex ${options.vertical ? "flex--row" : "flex--col"} flex--j-center`}>
      {series.map((s, i) => (
        <Flex key={i}
          flexDirection={options.vertical ? "column" : "row"}
          style={{ padding: `${options.vertical ? "0 16px 0 0" : "0 0 8px 0"}` }}>
          <Box width={options.vertical ? "60px" : "75px"}>
            <InputGroup
              small
              min={options.min || defaultOptions.min}
              max={options.max || defaultOptions.max}
              title={`${s.deviceName}-${s.fieldName}`}
              type="number"
              onChange={(v) => onInputChange(s, i, v)}
              value={s.data}
              step={options.stepSize || defaultOptions.stepSize} />
          </Box>
          <Box flexGrow="1" pl={options.vertical ? 0 : 3} pt={options.vertical ? 2 : 0}>
            <Slider
              {...options}
              min={options.min || defaultOptions.min}
              max={options.max || defaultOptions.max}
              stepSize={options.stepSize || defaultOptions.stepSize}
              disabled={isLoading}
              value={s.data}
              onChange={(v) => setSeries(sr => {
                let res = [...sr];
                res[i].data = v;
                return res;
              })}
              onRelease={() => onRelease(s)} />
          </Box>
        </Flex>
      ))}
    </div>
  )
}

export default Control;