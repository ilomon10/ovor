import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Colors, Card, Switch, Icon, Classes, Tooltip, Position, Tag, Dialog } from '@blueprintjs/core';
import { TabContext } from "components/tabSystem";
import AspectRatio from 'components/aspectratio';
import Container from 'components/container';
import Wrapper from 'components/wrapper';
import AddNewDevice from './addNewDevice';

const Devices = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    tab.setCurrentTabState({ title: 'Devices', path: location.pathname })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) =>
              (<div key={i}
                style={{ width: `${100 / 4}%`, padding: "0 8px", marginBottom: 16 }}>
                <Card interactive onClick={() => history.push(`/devices/${i}`)}>
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
                          <Tooltip content={<div className={Classes.TEXT_SMALL}>Event Name</div>} position={Position.LEFT}>
                            <Tag minimal className={Classes.MONOSPACE_TEXT}>device-{v}</Tag>
                          </Tooltip>
                        </div>
                      </div>
                      <div className={`flex-grow flex flex--col flex--j-center`} style={{ textAlign: "center" }}>
                        <h4 className={Classes.HEADING}>Device {v}</h4>
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