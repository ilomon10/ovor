import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TabContext } from '../components/tabSystem';
import { Colors, Classes, Navbar, Icon, EditableText } from '@blueprintjs/core';

const Device = () => {
  const tab = useContext(TabContext);
  const location = useLocation();
  const [deviceTitle, setsDeviceTitle] = useState('New Device')
  useEffect(() => {
    tab.setCurrentTabState({
      title: deviceTitle,
      path: location.pathname
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex">
      <Navbar>
        <div style={{ maxWidth: 1024, margin: '0 auto', height: '100%' }}>
          <Navbar.Group>
            <h4 className={`${Classes.HEADING} flex flex--i-center`} style={{ margin: 0 }}>
              <Icon className='flex-shrink-0' icon="stacked-chart" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              <EditableText selectAllOnFocus value={deviceTitle} onChange={v => setsDeviceTitle(v)} />
            </h4>
          </Navbar.Group>
          <Navbar.Group align="right" style={{textAlign: "right"}}>
            <div style={{ marginLeft: 16 }}>
              <div className={`${Classes.TEXT_SMALL}`} style={{color: Colors.GRAY3}}>SIM NUMBER</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`} style={{ margin: 0 }}>0823-4432-2849</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div className={Classes.TEXT_SMALL} style={{color: Colors.GRAY3}}>IMEI</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`} style={{ margin: 0 }}>{parseInt(Math.random() * 99999999999)}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div className={Classes.TEXT_SMALL} style={{color: Colors.GRAY3}}>DEVICE ID</div>
              <div className={`${Classes.HEADING} ${Classes.MONOSPACE_TEXT}`} style={{ margin: 0 }}>{parseInt(Math.random() * 99999)}</div>
            </div>
          </Navbar.Group>
        </div>
      </Navbar>
      <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: "100%" }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', paddingTop: 12 }}>

        </div>
      </div>
    </div>
  )
}

export default Device;