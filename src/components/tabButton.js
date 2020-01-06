import React, { useState } from 'react';
import { ButtonGroup, Button, Classes } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

const TabButton = ({ text, active, minimal, to, onClickClose, onClick, disableCloseButton, ...props }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <ButtonGroup {...props} onMouseEnter={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }} >
      <Link role="button"
        onClick={onClick}
        className={`${Classes.BUTTON} ${active ? Classes.ACTIVE : ""} ${minimal ? Classes.MINIMAL : ""}`}
        to={to} tabIndex={0}>
        {text}
      </Link>
      <Button minimal={minimal} active={active} icon={isHover && !disableCloseButton ? "cross" : ""} onClick={onClickClose} />
    </ButtonGroup>
  )
}

export default TabButton;