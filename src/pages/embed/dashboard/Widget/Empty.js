import React from 'react';
import { Classes } from '@blueprintjs/core';

const Empty = ({ title, text }) => {
  return (
    <div className="flex flex--col flex--i-center flex--j-center" style={{ height: '100%' }}>
      <h3 className={Classes.HEADING}>{title || "Empty"}</h3>
      {text && (<div>{text}</div>)}
    </div>
  )
}
export default Empty;