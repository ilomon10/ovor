import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { Colors, Classes, Divider, Navbar, Button, Icon, H5 } from '@blueprintjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Comp = ({ className, items }) => {
  const navList = items.filter((v) => !v.hide) || [];
  const [isToggled, setIsToggled] = useState(true);
  return (
    <div className={`${className} ${isToggled ? "sidebar-toggled" : ""} flex flex--col`} style={{ width: isToggled ? 240 : "auto" }}>
      <div className="flex-grow">
        <Navbar>
          <Navbar.Group align="center" style={{ textAlign: "center", justifyContent: "center" }}>
            <FontAwesomeIcon style={{ marginRight: isToggled ? 8 : 0, color: Colors.GRAY1 }} icon={['ovor', 'logo']} size="2x" />
            {isToggled &&
              <H5 style={{ margin: 0 }}>OVOR</H5>}
          </Navbar.Group>
        </Navbar>
        {navList.map((v) => (
          <NavLink className={`${Classes.BUTTON} ${Classes.FILL} ${Classes.MINIMAL} ${Classes.ALIGN_LEFT} ${Classes.LARGE}`}
            key={v.path}
            activeClassName={Classes.ACTIVE}
            role="button" to={v.path}>
            <Icon icon={v.icon} />
            {isToggled &&
              <span className={Classes.BUTTON_TEXT}>{v.title}</span>}
          </NavLink>
        ))}
        <Divider vertical="true" />
        <div style={{ textAlign: "center" }}>
          <Button minimal icon={isToggled ? "menu-closed" : "menu-open"} onClick={() => setIsToggled(!isToggled)} />
        </div>
      </div>
      <div className="flex-shrink-0">
        <Divider vertical="true" />
        <Button alignText="left" large minimal fill icon="notifications" text={isToggled ? "Notifications" : null} />
        <Button alignText="left" large minimal fill icon="user" text={isToggled ? "Imanuel Pundoko" : null} />
        <Button alignText="left" large minimal fill icon="info-sign" text={isToggled ? "Send Question" : null} />
      </div>
    </div>
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