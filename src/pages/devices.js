import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from "../components/tabSystem";
import { Colors, Card, Switch, Icon, Classes, Tooltip, Position, Tag } from '@blueprintjs/core';
import AspectRatio from '../components/aspectratio';

const Devices = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  useEffect(() => {
    tab.setCurrentTabState({
      title: 'Devices',
      path: location.pathname
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%' }}>
      <div style={{ width: 1024, margin: '0 auto', paddingTop: 24 }}>
        <div style={{ margin: '0 -8px' }} className="flex flex--wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) =>
            (<div key={i}
              style={{ width: `${100 / 4}%`, padding: "0 8px", marginBottom: 16 }}>
              <Card>
                <AspectRatio ratio="4:3">
                  <div className="flex flex--col" style={{ height: "100%" }}>
                    <div className="flex-shrink-0 flex">
                      <div className="flex-grow">
                        <Tooltip content="OFFLINE" position={Position.RIGHT}>
                          <Switch style={{ pointerEvents: "none", margin: 0 }}
                            innerLabelChecked="on" innerLabel="off" />
                        </Tooltip>
                      </div>
                      <div className="flex-shrink-0">
                        <Tooltip content="Event Name" position={Position.LEFT}>
                          <Tag minimal className={Classes.MONOSPACE_TEXT}>device-{v}</Tag>
                        </Tooltip>
                      </div>
                    </div>
                    <div className={`flex-grow flex flex--col flex--j-center`} style={{ textAlign: "center" }}>
                      <h4 className={Classes.HEADING}>Device {v}</h4>
                      <p className={`${Classes.TEXT_SMALL}`}>
                        <Icon iconSize={11} icon="map-marker" /><span> Indonesia</span>
                      </p>
                      <div style={{ color: Colors.GRAY1 }}>IP: 192.168.43.{parseInt(Math.random(v) * 255)}</div>
                    </div>
                  </div>
                </AspectRatio>
              </Card>
            </div>))}
        </div>
      </div>
    </div>
  )
}

export default Devices;