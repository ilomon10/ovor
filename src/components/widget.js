import React, { useState, useContext, useCallback } from 'react';
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
import ControlButton from './widgets/controlButton';
import ControlSlider from './widgets/controlSlider';
import Settings from './widgets/settings';
import WidgetContext from './widgets/hocs';
import { GRAPH_TYPE } from './widgets/constants';
import DashboardContext from './hocs/dashboard';

const Widget = ({ type, tileId, title = "Empty Window", path, ...props }) => {
  const { removeWidget } = useContext(DashboardContext);
  let Ret = null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const propsForChart = _merge({
    options: {
      chart: {
        id: tileId
      }
    }
  }, props);

  const forceRerender = useCallback(() => {
    setRerender(true);
    const timeout = setTimeout(() => {
      setRerender(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    }
  }, []);

  switch (type) {
    case GRAPH_TYPE["Slider"]:
      Ret = (<ControlSlider {...propsForChart} />);
      break;
    case GRAPH_TYPE["Button"]:
      Ret = (<ControlButton {...propsForChart} />);
      break;
    case GRAPH_TYPE["Numeric"]:
      Ret = (<Numeric {...propsForChart} />);
      break;
    case GRAPH_TYPE["Bar Chart"]:
      Ret = (<BarChart {...propsForChart} />);
      break;
    case GRAPH_TYPE["Time Series Graph"]:
      Ret = (<Timeseries {...propsForChart} />);
      break;
    case GRAPH_TYPE["Pie Chart"]:
      Ret = (<PieChart {...propsForChart} />);
      break;
    case GRAPH_TYPE["Table"]:
      Ret = (<Table {...propsForChart} />);
      break;
    default:
      Ret = (<Empty path={path} />);
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
              <Button key={"refresh"} className="mosaic-default-control"
                loading={rerender}
                minimal icon='refresh'
                onClick={() => forceRerender()} />,
              <Button key={"cog"} className="mosaic-default-control"
                minimal icon='cog'
                onClick={() => setIsDialogOpen(true)} />,
              <Button key={"cross"} className="mosaic-default-control" minimal icon='cross' onClick={() => {
                removeWidget(mosaicActions.remove.bind(this, path), tileId);
              }} />,
            ])}>
            {!rerender && Ret}
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