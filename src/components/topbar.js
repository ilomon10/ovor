import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { Navbar, Button } from '@blueprintjs/core';

import TabButton from './tabButton';
import { AppContext } from '../App';

const Comp = ({ className }) => {
  const [realTimeClock, setRealTimeClock] = useState(null);
  const { tab } = useContext(AppContext);
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeClock(() => moment().format('dddd, DD MMMM YYYY, hh:mm:ss A'));
    }, 1000);
    return () => clearInterval(interval);
  }, [])
  return (
    <Navbar className={`${className} flex`}>
      <Navbar.Group className="flex-grow">
        <Button minimal icon='plus' onClick={() => tab.addNewTab()} />
        {tab.tabs.map((v, i) => (
          <React.Fragment key={i}>
            <Navbar.Divider />
            <TabButton minimal
              disableCloseButton={!(tab.tabs.length > 1)}
              text={v.title} to={v.path}
              onClick={() => tab.changeActiveTab(i)}
              onClickClose={() => tab.removeTab(i)} />
          </React.Fragment>
        ))}
      </Navbar.Group>
      <Navbar.Group align="right" className="flex-shrink-0">
        {realTimeClock}
      </Navbar.Group>
    </Navbar>
  )
}

const TopBar = styled(Comp)`
`

export default withRouter(TopBar);