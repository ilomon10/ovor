import React, { useState, useContext, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router-dom';
import _get from 'lodash.get';
import AreaPlugin from 'rete-area-plugin';

import { FeathersContext } from 'components/feathers';
import { ReteEngineProvider } from 'components/hocs/reteEngine';
import { Box, Flex } from 'components/utility/grid';
import InputComponent from 'components/rete/nodes/input';
import OutputComponent from 'components/rete/nodes/output';
import PastComponent from 'components/rete/nodes/past';
import InjectComponent from 'components/rete/nodes/inject';
import ViewerComponent from 'components/rete/nodes/viewer';
import OperationComponent from 'components/rete/nodes/operation';
import TrigonometricComponent from 'components/rete/nodes/trigonometric';
import ComparisonComponent from 'components/rete/nodes/comparison';
import RoundingComponent from 'components/rete/nodes/rounding';
import LoggerComponent from 'components/rete/nodes/logger';
import ConversionComponent from 'components/rete/nodes/conversion';
import TimeGetterComponent from 'components/rete/nodes/timeGetter';
import SwitchComponent from 'components/rete/nodes/switch';
import IsEmptyComponent from 'components/rete/nodes/isEmpty';
import PIDComponent from 'components/rete/nodes/pid';

import Canvas from './canvas';
import Toolbar from './toolbar';
import Dock from './dock';

const removeListener = (obj, names, handler) => {
  if (typeof handler !== "function") return obj;

  const events = names instanceof Array ? names : (names).split(' ');

  (events).forEach(name => {
    let event = obj.events[name];
    if (event.length) {
      let position = -1;
      for (let i = event.length - 1; i >= 0; i--) {
        if (event[i].toString() === handler.toString()) {
          position = i;
          break;
        }
      }

      if (position < 0)
        return;

      obj.events[name].splice(position, 1);
    }
  });

  return obj;
}

const Component = ({ className }) => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const location = useLocation();
  const [device, setDevice] = useState({});
  const [rete, setRete] = useState({});
  const [components, setComponents] = useState([
    new ComparisonComponent(),
    new ConversionComponent(),
    new InjectComponent(),
    new IsEmptyComponent(),
    new LoggerComponent(),
    new OperationComponent(),
    new PIDComponent(),
    new RoundingComponent(),
    new SwitchComponent(),
    new TimeGetterComponent(),
    new TrigonometricComponent(),
    new ViewerComponent(),
  ]);

  useEffect(() => {
    if (!_get(device, 'fields')) return;

    const { fields } = device;
    const io = fields.map(field => {
      return {
        key: field._id,
        name: field.name,
        type: field.type
      }
    });

    setComponents(comps => ([
      new InputComponent({
        alias: "Input",
        outputs: io
      }),
      new OutputComponent({
        alias: "Output",
        inputs: io
      }),
      new PastComponent({
        alias: "Past",
        outputs: io
      }),
      ...comps]));

  }, [device]);

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      const deviceId = new URLSearchParams(location.search).get("deviceId");
      if (!deviceId) return;
      const device = await feathers.devices.get(deviceId, {
        query: { $select: ["reteId", "fields"] }
      });
      const { version, nodes } = await feathers.retes.get(params.id, {
        query: { $select: ["version", 'nodes'] }
      });
      await setRete({
        id: version,
        nodes,
      });
      await setDevice(device);
    }
    fetch();
  }, [feathers]); // eslint-disable-line react-hooks/exhaustive-deps

  const onEditorCreated = useCallback(async (editor, engine) => {

    components.forEach(c => {
      try {
        editor.register(c);
        engine.register(c);
      } catch (e) {
        return;
      }
    });

    if (_get(rete, "id")) {
      await editor.fromJSON(rete);
      AreaPlugin.zoomAt(editor, editor.nodes);
    }

    const onProcess = async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }

    removeListener(editor, "process connectioncreated connectionremoved", onProcess);

    editor.on('process connectioncreated connectionremoved', onProcess);

    return () => {
      removeListener(editor, "process connectioncreated connectionremoved", onProcess);
    }

  }, [components.length, rete]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDeploy = useCallback(async (json) => {
    await feathers.retes.patch(device.reteId, {
      version: json.id,
      nodes: json.nodes,
    })
  }, [feathers, rete, device.reteId]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Rete Editor | Ovor</title>
        <meta name="description" content="Rete algorithm editor" />
      </Helmet>
      <ReteEngineProvider components={components}>
        <div className={className}>
          <Toolbar onDeploy={onDeploy} />
          <Flex height="100%" width="100%">
            <Box flexShrink={0}
              width="200px">
              <Dock />
            </Box>
            <Box flexGrow={1} style={{ position: 'relative' }}  >
              <Canvas onCreated={onEditorCreated} />
            </Box>
          </Flex>
        </div>
      </ReteEngineProvider>
    </>
  )
}

const ReteEngine = styled(Component)`
  height: 100%;
`

export default ReteEngine;