import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Colors, Card, Switch, Icon, Classes, Tooltip, Position, Tag, Dialog, NonIdealState, Button } from '@blueprintjs/core';
import AspectRatio from 'components/aspectratio';
import Container from 'components/container';
import Wrapper from 'components/wrapper';
import AddNewDevice from './addNewDevice';
import { FeathersContext } from 'components/feathers';
import { Helmet } from 'react-helmet';
import { Box } from 'components/utility/grid';

const Devices = () => {
  const feathers = useContext(FeathersContext);
  const history = useHistory();
  const [list, setList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const onDeviceCreated = (e) => {
      setList([
        { _id: e._id, name: e.name, hostname: e.hostname },
        ...list
      ])
    }
    const onDevicePatched = (e) => {
      setList((ls) => {
        return ls.map((l) => l._id === e._id ? e : l);
      })
    }
    feathers.devices.on('created', onDeviceCreated);
    feathers.devices.on('patched', onDevicePatched);
    return () => {
      feathers.devices.removeListener('created', onDeviceCreated);
      feathers.devices.removeListener('patched', onDevicePatched);
    }
  }, [list, feathers]);
  useEffect(() => {
    feathers.devices.find({
      query: {
        $sort: { createdAt: -1 },
        $select: ["_id", 'name', 'hostname']
      }
    }).then((e) => {
      setList(e.data);
    }).catch(e => {
      console.error(e);
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Helmet>
        <title>Devices | Ovor</title>
        <meta name="description" content="Device browser" />
      </Helmet>
      <div style={{ backgroundColor: Colors.LIGHT_GRAY5, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
        <Wrapper style={{ overflowY: "auto" }}>
          <Container style={{ paddingTop: 12 }}>
            {list.length > 0 &&
              <div style={{ padding: '0 8px' }} className="flex flex--wrap">
                <Box width={[1, 1 / 2, 1 / 3, 1 / 4]}
                  px={2} mb={3}>
                  <Card interactive
                    style={{ backgroundColor: "transparent" }}
                    onClick={() => setIsDialogOpen(true)}>
                    <AspectRatio ratio="4:3">
                      <div className="flex flex--j-center flex--i-center" style={{ height: "100%" }}>
                        <Icon iconSize={64} icon="plus" color={Colors.GRAY1} />
                      </div>
                    </AspectRatio>
                  </Card>
                </Box>
                {list.map((v) =>
                (<Box key={v._id}
                  width={[1, 1 / 2, 1 / 3, 1 / 4]}
                  px={2} mb={3}>
                  <Card interactive onClick={() => history.push(`/device/${v._id}`)}>
                    <AspectRatio ratio="4:3">
                      <div className="flex flex--col" style={{ height: "100%" }}>
                        <div className="flex-shrink-0 flex">
                          <div className="flex-grow">
                            <Tooltip content={<div className={Classes.TEXT_SMALL}>{v.hostname ? "Online" : "Offline"}</div>} position={Position.RIGHT}>
                              <Switch style={{ pointerEvents: "none", margin: 0 }}
                                readOnly
                                checked={v.hostname ? true : false}
                                innerLabelChecked="on" innerLabel="off" />
                            </Tooltip>
                          </div>
                          <div className="flex-shrink-0">
                            <Tooltip content={<div className={Classes.TEXT_SMALL}>{v._id}</div>} position={Position.BOTTOM_RIGHT}>
                              <Tag minimal className={Classes.MONOSPACE_TEXT}>{v._id.slice(0, 3)}..{v._id.slice(v._id.length - 3, v._id.length)}</Tag>
                            </Tooltip>
                          </div>
                        </div>
                        <div className={`flex-grow flex flex--col flex--j-center`} style={{ textAlign: "center" }}>
                          <h4 className={Classes.HEADING}>{v.name}</h4>
                          <p className={`${Classes.TEXT_SMALL}`}>
                            <Icon iconSize={11} icon="map-marker" /><span> Indonesia</span>
                          </p>
                          {v.hostname &&
                            <div style={{ color: Colors.GRAY1 }}>ADDR: {v.hostname}</div>}
                        </div>
                      </div>
                    </AspectRatio>
                  </Card>
                </Box>))}
              </div>}
            {list.length === 0 &&
              <NonIdealState
                icon="application"
                title="Empty"
                description={<>
                  <p>You didn't have any device registered</p>
                  <Button outlined large
                    onClick={() => setIsDialogOpen(true)}
                    icon="plus" text="Register new one" />
                </>} />}
            <Dialog isOpen={isDialogOpen}
              usePortal={true}
              canOutsideClickClose={false}
              title="Add New Device"
              onClose={() => setIsDialogOpen(false)}>
              <AddNewDevice onClose={() => setIsDialogOpen(false)} />
            </Dialog>
          </Container>
        </Wrapper>
      </div>
    </>
  )
}

export default Devices;