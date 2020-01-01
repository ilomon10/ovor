import React, { useState } from 'react';
import { ButtonGroup, Button, Classes } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';

const TabButton = ({ text, active, minimal, to, onClickClose, onClick, disableCloseButton, ...props }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <ButtonGroup {...props} onMouseEnter={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }} >
      <NavLink role="button"
        onClick={onClick}
        className={`${Classes.BUTTON} ${active ? Classes.ACTIVE : ""} ${minimal ? Classes.MINIMAL : ""}`}
        activeClassName={Classes.ACTIVE}
        exact text={text} to={to} tabIndex={0}>
        {text}
      </NavLink>
      {isHover && !disableCloseButton &&
        <Button minimal={minimal} active={active} icon="cross" onClick={onClickClose} />}
    </ButtonGroup>
  )
}

export default TabButton;