import React, { useState, useContext } from 'react';
import {
  MosaicWindow,
  MosaicContext,
} from 'react-mosaic-component';
import { Button, Dialog } from '@blueprintjs/core';
import _merge from 'lodash.merge';
import Timeseries from './widgets/timeseries';
import BarChart from './widgets/barChart';
import PieChart from './widgets/pieChart';
import Table from './widgets/table';
import Empty from './widgets/empty';
import Numeric from './widgets/numeric';
import Control from './widgets/control';
import Settings from './widgets/settings';
import WidgetContext from './widgets/hocs';
import { GRAPH_TYPE } from './widgets/constants';
import DashboardContext from './hocs/dashboard';

const Widget = ({ type, tileId, title = "Empty Window", path, ...props }) => {
  const { removeWidget } = useContext(DashboardContext);
  let ret = null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const propsForChart = _merge({
    options: {
      chart: {
        id: tileId
      }
    }
  }, props);
  switch (type) {
    case GRAPH_TYPE["Control"]:
      ret = (<Control {...propsForChart} />);
      break;
    case GRAPH_TYPE["Numeric"]:
      ret = (<Numeric {...propsForChart} />);
      break;
    case GRAPH_TYPE["Bar Chart"]:
      ret = (<BarChart {...propsForChart} />);
      break;
    case GRAPH_TYPE["Time Series Graph"]:
      ret = (<Timeseries {...propsForChart} />);
      break;
    case GRAPH_TYPE["Pie Chart"]:
      ret = (<PieChart {...propsForChart} />);
      break;
    case GRAPH_TYPE["Table"]:
      ret = (<Table {...propsForChart} />);
      break;
    default:
      ret = (<Empty path={path} />);
      break;
  }
  return (
    <WidgetContext.Provider value={{
      setIsDialogOpen,
      id: tileId,
      title,
      type,
      series: props.series,
      options: props.options
    }}>
      <MosaicContext.Consumer>
        {({ mosaicActions }) => {
          return (<MosaicWindow
            title={title}
            path={path}
            toolbarControls={([
              <Button key={"cog"} className="mosaic-default-control"
                minimal icon='cog'
                onClick={() => setIsDialogOpen(true)} />,
              <Button key={"cross"} className="mosaic-default-control" minimal icon='cross' onClick={() => {
                removeWidget(mosaicActions.remove.bind(this, path), tileId);
              }} />,
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