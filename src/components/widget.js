import React from 'react';
import {
  MosaicWindow
} from 'react-mosaic-component';
import PlotLine from './widgets/plot.line';
import PlotBar from './widgets/plot.bar';

const Widget = ({ type, title, path, ...props }) => {
  let ret = null;
  switch (type) {
    case 'plot.bar':
      ret = (<PlotBar {...props} />);
      break;
    case 'plot.line':
      ret = (<PlotLine {...props} />);
      break;
    default:
      ret = null;
      break;
  }
  return (
    <MosaicWindow
      title={title}
      path={path}>
      {ret}
    </MosaicWindow>
  )
}

export default Widget;