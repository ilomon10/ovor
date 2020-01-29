import React from 'react';
import { Classes, Button } from '@blueprintjs/core';
import WidgetContext from './hocs';

const Empty = () => {
  return (
    <WidgetContext.Consumer>
      {({ setIsDialogOpen }) => {
        return (<div className="flex flex--col flex--i-center flex--j-center" style={{ height: '100%' }}>
          <h3 className={Classes.HEADING}>EMPTY</h3>
          <div>
            <span>Setup </span>
            <Button small text="widget" onClick={() => setIsDialogOpen(true)} />
            <span> at this window</span>
          </div>
        </div>)
      }}
    </WidgetContext.Consumer>
  )
}
export default Empty;