import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Navbar, Button, Classes, Icon } from '@blueprintjs/core';

import TabButton from './tabButton';
import { TabContext } from './tabSystem';

const Comp = ({ className }) => {
  const [realTimeClock, setRealTimeClock] = useState(new Date());
  const tab = useContext(TabContext);
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeClock(() => new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [])
  return (
    <Navbar className={`${className} ${Classes.DARK} flex`}>
      <Navbar.Group className="flex-grow">
        <Button minimal icon='plus' onClick={() => tab.addNewTab()} />
        {tab.tabs.map((v, i) => (
          <React.Fragment key={i}>
            <Navbar.Divider />
            <TabButton minimal
              disableCloseButton={!(tab.tabs.length > 1)}
              active={tab.activeTab === i}
              text={v.title} to={v.path}
              onClick={() => tab.setActiveTab(i)}
              onClickClose={() => tab.removeTab(i)} />
          </React.Fragment>
        ))}
      </Navbar.Group>
      <Navbar.Group align="right" className="flex-shrink-0">
        <div style={{ textAlign: 'right' }}>
          <div>{moment(realTimeClock).format('hh:mm:ss A')}</div>
          <div>{moment(realTimeClock).format('dddd, DD MMMM YYYY')}</div>
        </div>
        <Icon style={{ marginLeft: 8 }}
          icon="calendar" iconSize={20} />
      </Navbar.Group>
    </Navbar>
  )
}

const TopBar = styled(Comp)`
`

export default withRouter(TopBar);