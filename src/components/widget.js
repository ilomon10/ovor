import React, { useState } from 'react';
import {
  MosaicWindow,
  MosaicContext,
} from 'react-mosaic-component';
import PlotLine from './widgets/plot.line';
import PlotBar from './widgets/plot.bar';
import Radial from './widgets/radial';
import { Button, Dialog } from '@blueprintjs/core';
import Empty from './widgets/empty';
import Settings from './widgets/settings';
import WidgetContext from './widgets/hocs';
import Table from './widgets/table';

const Widget = ({ type, title = "Empty Window", path, ...props }) => {
  let ret = null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  switch (type) {
    case 'plot.bar':
      ret = (<PlotBar {...props} />);
      break;
    case 'plot.line':
      ret = (<PlotLine {...props} />);
      break;
    case 'radial':
      ret = (<Radial {...props} />);
      break;
    case 'table':
      ret = (<Table {...props} />);
      break;
    default:
      ret = (<Empty />);
      break;
  }
  return (
    <WidgetContext.Provider value={{ setIsDialogOpen }}>
      <MosaicContext.Consumer>
        {({ mosaicActions }) => {
          return (<MosaicWindow
            title={title}
            path={path}
            toolbarControls={([
              <Button key={"cog"} className="mosaic-default-control" minimal icon='cog' />,
              <Button key={"cross"} className="mosaic-default-control" minimal icon='cross' onClick={() => mosaicActions.remove(path)} />,
            ])}>
            {ret}
            <Dialog
              title={title}
              canEscapeKeyClose
              canOutsideClickClose
              onClose={() => setIsDialogOpen(false)}
              isOpen={isDialogOpen}
              usePortal>
              <Settings />
            </Dialog>
          </MosaicWindow>)
        }}
      </MosaicContext.Consumer>
    </WidgetContext.Provider>
  )
}

export default Widget;