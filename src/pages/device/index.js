import moment from 'moment';
import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import {
  Colors, Classes, Navbar, EditableText, Card, H4,
  Button, ResizeSensor, Dialog,
  AnchorButton
} from '@blueprintjs/core';
import { Helmet } from 'react-helmet';

import Wrapper from 'components/wrapper';
import { FeathersContext } from 'components/feathers';
import InputCopy from 'components/inputCopy';
import { useMedia } from 'components/helper';
import { Flex, Box } from 'components/utility/grid';
import { container } from 'components/utility/constants';

import DeleteDevice from './deleteDevice';
import ConfigFields from './configFields';
import IncomingChart from './IncomingChart';

const Device = () => {
  const feathers = useContext(FeathersContext);
  const params = useParams();
  const history = useHistory();
  const columnCount = useMedia(
    container.map((v) => `(min-width: ${v})`).reverse(),
    [5, 4, 3, 2], 1
  )
  const [isDialogOpen, setIsDialogOpen] = useState({
    delete_data: false,
    delete: false,
    config: false
  });

  const [device, setDevice] = useState({
    _id: '',
    name: '',
    key: '',
    fields: [],
    lastConnection: '',
    lastRx: null,
    lastTx: null
  });

  // Component Did Mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const device = await feathers.devices.get(params.id, {
          query: {
            $select: ["_id", "name", "fields", "hostname", "lastConnection", "lastTx", "lastRx", "key"]
          }
        });
        await setDevice({ ...device });
      } catch (e) {
        console.error(e);
      }
    }
    fetch();
    const onDevicePatched = (e) => {
      let d = { ...e };
      delete d["createdAt"];
      delete d["updatedAt"];
      delete d["userId"];
      setDevice(d);
    }
    feathers.devices.on('patched', onDevicePatched);
    return () => {
      feathers.devices.removeListener('patched', onDevicePatched);
    }
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>{device.name} - Device | Ovor</title>
        <meta name="description" content="Device overview" />
      </Helmet>
      <div className="flex flex--col" style={{ height: "100%" }}>
        <Navbar className="flex-shrink-0">
          <Box maxWidth={[container.sm, container.sm, container.md, container.xl]} mx="auto">
            <Navbar.Group>
              <Link
                to="/devices"
                icon="chevron-left"
                component={React.forwardRef(({ navigate, ...props }, ref) => (
                  <AnchorButton ref={ref} {...props} />
                ))}
              />
              <Navbar.Divider />
              <h4
                className={`${Classes.HEADING} flex flex--i-center`}
                style={{ margin: 0, maxWidth: columnCount < 2 ? 130 : "initial" }}
              >
                <EditableText
                  selectAllOnFocus
                  value={device.name}
                  onChange={v => setDevice({ ...device, name: v })}
                />
              </h4>
            </Navbar.Group>
            <Navbar.Group align="right">
              <Button minimal={true} text="Configure fields"
                onClick={() => { setIsDialogOpen(s => ({ ...s, config: true })); }} />
              <Dialog
                title="Configure Fields"
                isOpen={isDialogOpen['config']}
                onClose={() => { setIsDialogOpen(s => ({ ...s, config: false })); }}>
                <ConfigFields data={device} onClose={() => { setIsDialogOpen(s => ({ ...s, config: false })); }} />
              </Dialog>
            </Navbar.Group>
          </Box>
        </Navbar>
        <div className="flex-grow" style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'relative' }}>
          <ResizeSensor>
            <Wrapper style={{ overflowY: 'auto' }}>
              <Box py={3} maxWidth={[container.sm, container.sm, container.md, container.lg]} mx="auto">
                <Box mx={-3}>
                  <Flex px={3} mb={3} flexDirection={columnCount < 2 ? "column" : "row"}>
                    <Box px={3} width={columnCount < 2 ? `100%` : `50%`}>
                      <Box mb={2}>
                        <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>DEVICE ID</div>
                        <InputCopy fill value={`${device._id}`} />
                      </Box>
                      <Box mb={2}>
                        <div className={Classes.TEXT_SMALL} style={{ color: Colors.GRAY3 }}>KEY</div>
                        <InputCopy fill value={`${device.key}`} />
                      </Box>
                    </Box>
                    <Box px={3} width={columnCount < 2 ? `100%` : `50%`}>
                      <Box mb={2}>
                        <div className={`${Classes.TEXT_SMALL}`} style={{ color: Colors.GRAY3 }}>LAST ADDRESS</div>
                        <Box lineHeight="30px" className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                          style={{ margin: 0 }}>{device.hostname || "-.-.-.-"}</Box>
                      </Box>
                      <Box mb={2}>
                        <div className={`${Classes.TEXT_SMALL}`} style={{ color: Colors.GRAY3 }}>LAST CONNECTION</div>
                        <Box lineHeight="30px" className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`}
                          style={{ margin: 0 }}>
                          <span>{moment(device["lastConnection"]).calendar() || "..."}</span>
                        </Box>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
                <Box px={3} mb={4}>
                  <Card style={{ padding: 0 }}>
                    <div className="flex" style={{ padding: "16px 16px 0 16px" }}>
                      <H4 className="flex-grow" style={{ margin: 0 }}>Recent Connection</H4>
                      {/* <div>
                        <span>last </span>
                        <HTMLSelect
                          options={Object.keys(dateRange)}
                          value={ }
                        />
                      </div> */}
                    </div>
                    <IncomingChart style={{ height: 127 }} />
                  </Card>
                </Box>
                <Box mb={3} px={3}>
                  <Flex alignItems="center">
                    <Box flexGrow={1}>
                      <h4 className={Classes.HEADING}>Delete this device</h4>
                      <p>Once you delete a device, there is no going back. Please be certain</p>
                    </Box>
                    <Box flexShrink={0} >
                      <Button text="Delete this device" intent="danger" onClick={() => setIsDialogOpen(s => ({ ...s, delete: true }))} />
                    </Box>
                  </Flex>
                </Box>
              </Box>
              <Dialog usePortal={true}
                title="Delete device"
                isOpen={isDialogOpen['delete']}
                onClose={() => { setIsDialogOpen(s => ({ ...s, delete: false })); }}>
                <DeleteDevice data={device} onClose={() => { setIsDialogOpen(s => ({ ...s, delete: false })); }} onDeleted={() => history.goBack()} />
              </Dialog>
            </Wrapper>
          </ResizeSensor>
        </div>
      </div>
    </>
  )
}

export default Device;