import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { Colors, Classes, Divider, Navbar, Button, AnchorButton, Icon, H5, Menu, Popover, Tooltip } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FeathersContext } from './feathers';
import Notification from '../pages/notification';

const Comp = ({ className, items }) => {
  const feathers = useContext(FeathersContext);
  const navList = items.filter((v) => !v.hide) || [];
  const [isToggled, setIsToggled] = useState(false);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    async function getUserData() {
      const { user } = await feathers.doGet('authentication');
      setEmail(user.email);
    }
    getUserData();
  }, [feathers])
  return (
    <div className={`${className} ${isToggled ? "sidebar-toggled" : ""} flex flex--col`} style={{ maxWidth: isToggled ? 240 : "auto" }}>
      <div className="flex-grow">
        <Navbar style={{ boxShadow: '0 0 0 rgba(16, 22, 26, 0), 0 1px 1px rgba(16, 22, 26, 0.2)' }}>
          <Navbar.Group align="center" style={{ textAlign: "center", justifyContent: "center" }}>
            <FontAwesomeIcon style={{ marginRight: isToggled ? 8 : 0, color: Colors.GRAY1 }} icon={['ovor', 'logo']} size="2x" />
            {isToggled &&
              <H5 style={{ margin: 0 }}>OVOR</H5>}
          </Navbar.Group>
        </Navbar>
        <Button minimal fill alignText="left" text={isToggled ? 'Menu' : null}
          icon={isToggled ? "menu-closed" : "menu-open"} onClick={() => setIsToggled(!isToggled)} />
        {navList.map((v) => (
          <NavLink className={`${Classes.BUTTON} ${Classes.FILL} ${Classes.MINIMAL} ${Classes.ALIGN_LEFT}`}
            key={v.path}
            activeClassName={Classes.ACTIVE}
            role="button" to={v.path}>
            <Icon icon={v.icon} />
            {isToggled &&
              <span className={Classes.BUTTON_TEXT}>{v.title}</span>}
          </NavLink>
        ))}
      </div>
      <div className="flex-shrink-0">
        <Divider vertical="true" />
        <Popover
          position="left"
          targetProps={{
            style: { display: 'block' }
          }}
          content={(
            <Notification />
          )}>
          <Tooltip isOpen
            intent={'warning'}
            content={`${2} New Message`}
            position="left"
            targetProps={{
              style: { display: 'block' }
            }}>
            <Button alignText="left" minimal fill icon="notifications" text={isToggled ? "Notifications" : null} />
          </Tooltip>
        </Popover>
        <Popover
          position="left-bottom"
          targetProps={{
            style: { display: 'block' }
          }}
          content={(
            <Menu>
              <Menu.Item disabled icon="cog" text="Preference" />
              <Divider />
              <Menu.Item icon="log-out" text="Logout" intent="danger" />
            </Menu>)}>
          <Button alignText="left" minimal fill icon="user" text={isToggled ? email : null} />
        </Popover>
        <AnchorButton href="https://github.com/ilomon10/ovor-issue_tracker/issues"
          target="_blank"
          alignText="left" minimal fill icon="info-sign" text={isToggled ? "Send Question" : null} />
      </div>
    </div >
  )
}

const Sidebar = styled(Comp)`
  border-right: 1px solid ${Colors.GRAY5};
  padding-bottom: 15px;
  &&& .${Classes.BUTTON} {
    padding: 12px 24px;
  }
  &&& .${Classes.DIVIDER} {
    margin: 8px 12px;
  }
`

export default Sidebar;