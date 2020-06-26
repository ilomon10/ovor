import React from 'react';
import { Link } from 'react-router-dom';
import { Classes, Icon } from '@blueprintjs/core';

const LinkButton = ({ style, onClick, className, to, active, minimal, text, icon, fill, alignText }) => {
  return (
    <Link role="button"
      style={style}
      onClick={onClick}
      className={`${Classes.BUTTON} ${active ? Classes.ACTIVE : ""} ${minimal ? Classes.MINIMAL : ""} ${fill ? Classes.FILL : ""} ${alignText === 'left' ? Classes.ALIGN_LEFT : alignText === 'right' ? Classes.ALIGN_RIGHT : ''} ${className}`}
      to={to} tabIndex={0}>
      {icon &&
        <Icon icon={icon} />}
      <span className={Classes.BUTTON_TEXT}>{text}</span>
    </Link>
  )
}

export default LinkButton;