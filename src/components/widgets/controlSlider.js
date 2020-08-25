import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Slider } from '@blueprintjs/core';
import _merge from 'lodash.merge';
import _uniqBy from 'lodash.uniqby';
import { FeathersContext } from 'components/feathers';

export const sliderOptions = {
  max: { type: 'number' },
  min: { type: 'number' },
  stepSize: { type: 'number' },
  vertical: { type: 'boolean' },
  labelStepSize: { type: 'number' },
}

export const sliderConfig = {
  maxSeries: 1,
  acceptedType: ['number']
}

const defaultOptions = {
  min: 0,
  max: 10,
  stepSize: 0.1,
  labelStepSize: 1
}

const Control = ({ ...props }) => {
  const options = _merge(defaultOptions, props.options);
  const feathers = useContext(FeathersContext);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)];
      const devices = await feathers.devices().find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      })
      const query = {
        $aggregate: 'deviceId',
        deviceId: { $in: deviceIds },
        $select: ['data', 'deviceId']
      }
      let dataLake = await feathers.dataLake().find({ query });
      let Series = props.series.map(s => {
        const device = devices.data.find(d => d._id === s.device);
        const field = device.fields.find(f => f._id === s.field);
        let data = dataLake.data.filter(dl => (dl.deviceId === device._id));
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
  const onRelease = useCallback((cs) => {
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
        await feathers.dataLake().create(payload);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }
    push();
  }, [series]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{
      width: '100%', height: '100%',
      padding: options.vertical ? '24px 12px' : '12px 24px'
    }} className={`flex ${options.vertical ? "flex--row" : "flex--col"} flex--j-center`}>
      {series.map((s, i) => (
        <div key={i}
          style={{ padding: `${options.vertical ? "0 16px 0 0" : "0 0 8px 0"}` }}>
          <Slider
            {...options}
            disabled={isLoading}
            value={s.data}
            onChange={(v) => setSeries(sr => {
              let res = [...sr];
              res[i].data = v;
              return res;
            })}
            onRelease={() => onRelease(s)} />
        </div>
      ))}
    </div>
  )
}

export default Control;