import React, { useState, useEffect, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { NavLink, useHistory } from 'react-router-dom';
import { Colors, Classes, Divider, Navbar, Button, AnchorButton, Icon, H5, Menu, Popover, Tooltip } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import pjson from "../../package.json";

import { FeathersContext } from './feathers';
import Notification from '../pages/notification';
import { Box } from './utility/grid';

const Comp = ({ className, items }) => {
  const feathers = useContext(FeathersContext);
  const history = useHistory();
  const navList = items.filter((v) => !v.hide) || [];
  const version = useMemo(() => pjson.version.split('-'), []);
  const [isToggled, setIsToggled] = useState(false);
  const [isNotificationTouched, setIsNotificationTouched] = useState(true);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    async function getUserData() {
      const { user } = await feathers.doGet('authentication');
      setEmail(user.email);
    }
    getUserData();
  }, [feathers]);
  useEffect(() => {
    const onLoggerCreated = (log) => {
      setIsNotificationTouched(false);
      new Promise((resolve) => {
        window.Notification.requestPermission((state) => {
          if (state !== "default")
            resolve();
        })
      }).then(() => {
        new window.Notification("OVoRD", {
          body: log.message
        });
      })
    }
    feathers.logger.on('created', onLoggerCreated);
    return () => {
      feathers.logger.removeListener('created', onLoggerCreated);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
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
        {navList.map((v) => (
          <Tooltip key={v.path}
            usePortal={false}
            disabled={isToggled}
            content={v.title}
            position="left"
            targetTagName="div">
            <NavLink className={`${Classes.BUTTON} ${Classes.FILL} ${Classes.MINIMAL} ${Classes.ALIGN_LEFT}`}
              activeClassName={Classes.ACTIVE}
              exact={v.navExact}
              role="button" to={v.path}>
              <Icon icon={v.icon} />
              {isToggled &&
                <span className={Classes.BUTTON_TEXT}>{v.title}</span>}
            </NavLink>
          </Tooltip>
        ))}
      </div>
      <div className="flex-shrink-0">
        <Divider vertical="true" />
        <Popover
          position="left"
          targetTagName="div"
          content={(
            <Box width={260}>
              <Notification />
            </Box>
          )}>
          <Tooltip isOpen={!isNotificationTouched}
            intent={'warning'}
            content={`New Message`}
            position="left"
            targetTagName="div">
            <Button alignText="left" minimal fill
              icon="notifications"
              text={isToggled ? "Notifications" : null}
              onClick={() => {
                if (!isNotificationTouched)
                  setIsNotificationTouched(true);
              }} />
          </Tooltip>
        </Popover>
        <Popover
          position="left-bottom"
          targetTagName="div"
          content={(
            <Menu>
              <Menu.Item disabled icon="cog" text="Preference" />
              <Divider />
              <Menu.Item icon="log-out" text="Logout" onClick={() => {
                feathers.doLogout().then(() => {
                  history.push('/login');
                });
              }} intent="danger" />
            </Menu>)}>
          <Tooltip
            usePortal={false}
            disabled={isToggled}
            content={email}
            position="left"
            targetTagName="div">
            <Button alignText="left" minimal fill icon="user"
              text={isToggled ? email : null} />
          </Tooltip>
        </Popover>
        <Tooltip
          usePortal={false}
          disabled={isToggled}
          content={"Feedback"}
          position="left"
          targetTagName="div">
          <AnchorButton href="https://github.com/ilomon10/ovor-docs/issues"
            minimal fill
            icon="lifesaver"
            rightIcon={isToggled ? "share" : null}
            target="_blank"
            alignText="left"
            text={isToggled ? "Feedback" : null} />
        </Tooltip>
        <Divider />
        <Button minimal fill alignText="left"
          icon={isToggled ? "menu-closed" : "menu-open"} onClick={() => setIsToggled(!isToggled)} />
        <div className={Classes.TEXT_MUTED} style={{ textAlign: 'center' }}>
          <small>v{version[0]} {version[1] && (!isToggled ? '' : `(${version[1]})`)}</small>
        </div>
      </div>
    </div >
  )
}

const Sidebar = styled(Comp)`
  border-right: 1px solid ${Colors.GRAY5};
  padding-bottom: 15px;
  
  & .${Classes.BUTTON} {
    > :last-child {
      margin-right: 0;
    }
    > * {
      margin-right: 14px;
    }
    
    .${Classes.BUTTON_TEXT} {
      color: ${Colors.GRAY1};
      font-weight: bold;  
    }
    &.${Classes.ACTIVE} {
      background-color: transparent;
      :hover {
        background-color: rgba(167, 182, 194, 0.3);
      }
      .${Classes.BUTTON_TEXT}, .${Classes.ICON} {
        color: ${Colors.INDIGO3};
      }
    }
  }
  &&& .${Classes.BUTTON} {
    padding: 12px 24px;
  }
  &&& .${Classes.DIVIDER} {
    margin: 8px 12px;
  }
`

export default Sidebar;