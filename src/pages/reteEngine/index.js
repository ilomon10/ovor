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
import ViewerComponent from 'components/rete/nodes/viewer';
import OperationComponent from 'components/rete/nodes/operation';
import TrigonometricComponent from 'components/rete/nodes/trigonometric';
import ComparisonComponent from 'components/rete/nodes/comparison';
import RoundingComponent from 'components/rete/nodes/rounding';
import LoggerComponent from 'components/rete/nodes/logger';
import ConversionComponent from 'components/rete/nodes/conversion';

import Canvas from './canvas';
import Toolbar from './toolbar';
import Dock from './dock';

const Component = ({ className }) => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const location = useLocation();
  const [device, setDevice] = useState({});
  const [rete, setRete] = useState({});
  const [components, setComponents] = useState([
    new ViewerComponent(),
    new LoggerComponent(),
    new ConversionComponent(),
    // new InjectComponent(),
    new OperationComponent(),
    new TrigonometricComponent(),
    new ComparisonComponent(),
    new RoundingComponent()
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
        outputs: io
      }),
      new OutputComponent({
        inputs: io
      }), ...comps]));

  }, [device]);

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      const { device } = location.state;
      const { _id, ...rete } = await feathers.retes().get(params.id, {
        query: { $select: ['id', 'nodes'] }
      });
      await setRete(rete);
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

    if (_get(rete, 'id')) {
      await editor.fromJSON(rete);
      AreaPlugin.zoomAt(editor, editor.nodes);
    }

    const onProcess = async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }

    editor.on('process connectioncreated connectionremoved', onProcess);

  }, [components.length, rete]); // eslint-disable-line react-hooks/exhaustive-deps
  const onDeploy = useCallback(async (json) => {
    await feathers.retes().patch(device.reteId, {
      id: json.id,
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