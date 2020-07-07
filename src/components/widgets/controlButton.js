import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Button, Classes } from '@blueprintjs/core';
import { FeathersContext } from 'components/feathers';
import _uniqBy from 'lodash.uniqby';

const Control = ({ ...props }) => {
  const feathers = useContext(FeathersContext);
  const [isLoading, setIsLoading] = useState(false);
  const [series, setSeries] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const deviceIds = [..._uniqBy(props.series, 'device').map(v => v.device)];
      let devices = await feathers.devices().find({
        query: {
          _id: { $in: deviceIds },
          $select: ['fields', 'name']
        }
      });
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

  useEffect(() => {
    if (props.timeRange) return;
    const onDataCreated = (e) => {
      setSeries([
        ...series.map(s => {
          if (s.device !== e.deviceId) return s;
          if (typeof e.data[s.fieldName] === 'undefined') return s;
          s.data = e.data[s.fieldName];
          return s;
        })
      ])
    }
    feathers.dataLake().on('created', onDataCreated);
    return () => {
      feathers.dataLake().removeListener('created', onDataCreated);
    }
  }, [series]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClick = useCallback((cs) => {
    const push = async () => {
      setIsLoading(true);
      let data = {};
      series.forEach(s => {
        let res = s.data;
        if (s.device !== cs.device) return;
        if (s.fieldName === cs.fieldName) res = !cs.data;
        data[s.fieldName] = res;
      });
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
  }, [series]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: '100%', height: '100%' }} className="flex flex--col">
      {series.map((s, i) => (
        <Button key={i} fill
          className="flex-grow"
          loading={isLoading}
          onClick={() => onClick(s)}
          intent={s.data ? "success" : "none"}
          text={(<>
            <div className={Classes.TEXT_OVERFLOW_ELLIPSIS}>{s.name}</div>
            <div className={Classes.TEXT_OVERFLOW_ELLIPSIS}>
              <small>{s.deviceName}</small>
            </div>
          </>)} />
      ))}
    </div>
  )
}

export default Control;