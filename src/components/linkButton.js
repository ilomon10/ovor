import React from 'react';
import { Link } from 'react-router-dom';
import { Classes, Icon } from '@blueprintjs/core';

const LinkButton = ({ style, onClick, className, to, active, minimal, text, icon, rightIcon, fill, small, outlined, alignText }) => {
  return (
    <Link role="button"
      style={style}
      onClick={onClick}
      className={`${Classes.BUTTON} ${active ? Classes.ACTIVE : ""} ${outlined ? Classes.OUTLINED : ""} ${minimal ? Classes.MINIMAL : ""} ${small ? Classes.SMALL : ""} ${fill ? Classes.FILL : ""} ${alignText === 'left' ? Classes.ALIGN_LEFT : alignText === 'right' ? Classes.ALIGN_RIGHT : ''} ${className ? className : ''}`}
      to={to} tabIndex={0}>
      {icon &&
        <Icon icon={icon} />}
      <span className={Classes.BUTTON_TEXT}>{text}</span>
      {rightIcon &&
        <Icon icon={rightIcon} />}
    </Link>
  )
}

export default LinkButton;