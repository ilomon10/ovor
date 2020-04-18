import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Colors, Card, Switch, Icon, Classes, Tooltip, Position, Tag, Dialog } from '@blueprintjs/core';
import { TabContext } from "components/tabSystem";
import AspectRatio from 'components/aspectratio';
import Container from 'components/container';
import Wrapper from 'components/wrapper';
import AddNewDevice from './addNewDevice';
import { FeathersContext } from 'components/feathers';

const Devices = () => {
  const tab = useContext(TabContext);
  const feathers = useContext(FeathersContext);
  const location = useLocation();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    const onDeviceCreated = (e) => {
      setList([
        { _id: e._id, name: e.name },
        ...list
      ])
    }
    feathers.devices().on('created', onDeviceCreated);
    return () => {
      feathers.devices().removeListener('created', onDeviceCreated);
    }
  }, [list, feathers]);
  useEffect(() => {
    tab.setCurrentTabState({ title: 'Devices', path: location.pathname })
    feathers.devices().find({
      query: {
        $sort: { createdAt: -1 },
        $select: ['name']
      }
    }).then((e) => {
      console.log(e);
      setList(e.data);
    }).catch(e => {
      console.log(e);
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%', position: "relative" }}>
      <Wrapper style={{ overflowY: "auto" }}>
        <Container style={{ paddingTop: 12 }}>
          <div style={{ padding: '0 8px' }} className="flex flex--wrap">
            <div style={{ width: `${100 / 4}%`, padding: "0 8px", marginBottom: 16 }}>
              <Card interactive
                style={{ backgroundColor: "transparent" }}
                onClick={() => setIsDialogOpen(true)}>
                <AspectRatio ratio="4:3">
                  <div className="flex flex--j-center flex--i-center" style={{ height: "100%" }}>
                    <Icon iconSize={64} icon="plus" color={Colors.GRAY1} />
                  </div>
                </AspectRatio>
              </Card>
            </div>
            {list.map((v) =>
              (<div key={v._id}
                style={{ width: `${100 / 4}%`, padding: "0 8px", marginBottom: 16 }}>
                <Card interactive onClick={() => history.push(`/devices/${v._id}`)}>
                  <AspectRatio ratio="4:3">
                    <div className="flex flex--col" style={{ height: "100%" }}>
                      <div className="flex-shrink-0 flex">
                        <div className="flex-grow">
                          <Tooltip content={<div className={Classes.TEXT_SMALL}>Offline</div>} position={Position.RIGHT}>
                            <Switch style={{ pointerEvents: "none", margin: 0 }}
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
                        <div style={{ color: Colors.GRAY1 }}>IP: 192.168.43.{Math.floor(Math.random() * 255)}</div>
                      </div>
                    </div>
                  </AspectRatio>
                </Card>
              </div>))}
          </div>
        </Container>
      </Wrapper>
      <Dialog isOpen={isDialogOpen}
        usePortal={true}
        canOutsideClickClose={false}
        title="Add New Device"
        onClose={() => setIsDialogOpen(false)}>
        <AddNewDevice onClose={() => setIsDialogOpen(false)} />
      </Dialog>
    </div>
  )
}

export default Devices;