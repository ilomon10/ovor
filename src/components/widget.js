import React, { useState } from 'react';
import {
  MosaicWindow,
  MosaicContext,
} from 'react-mosaic-component';
import { Button, Dialog } from '@blueprintjs/core';
import Timeseries from './widgets/timeseries';
import BarChart from './widgets/barChart';
import PieChart from './widgets/pieChart';
import Table from './widgets/table';
import Empty from './widgets/empty';
import Settings from './widgets/settings';
import WidgetContext from './widgets/hocs';
import { GRAPH_TYPE } from './widgets/constants';

const Widget = ({ type, title = "Empty Window", path, ...props }) => {
  let ret = null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  switch (type) {
    case GRAPH_TYPE["Bar Chart"]:
      ret = (<BarChart {...props} />);
      break;
    case GRAPH_TYPE["Time Series Graph"]:
      ret = (<Timeseries {...props} />);
      break;
    case GRAPH_TYPE["Pie Chart"]:
      ret = (<PieChart {...props} />);
      break;
    case GRAPH_TYPE["Table"]:
      ret = (<Table {...props} />);
      break;
    default:
      ret = (<Empty path={path} />);
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
              <Button key={"cog"} className="mosaic-default-control" minimal icon='cog' onClick={() => setIsDialogOpen(true)} />,
              <Button key={"cross"} className="mosaic-default-control" minimal icon='cross' onClick={() => mosaicActions.remove(path)} />,
            ])}>
            {ret}
            <Dialog
              title={"Configure Widget"}
              canEscapeKeyClose
              canOutsideClickClose
              onClose={() => setIsDialogOpen(false)}
              isOpen={isDialogOpen}
              usePortal>
              <Settings path={path} onClose={() => setIsDialogOpen(false)} />
            </Dialog>
          </MosaicWindow>)
        }}
      </MosaicContext.Consumer>
    </WidgetContext.Provider>
  )
}

export default Widget;