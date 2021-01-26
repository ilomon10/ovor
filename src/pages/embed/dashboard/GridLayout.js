import React from "react";
import { Box } from "components/utility/grid";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button, Colors, ResizeSensor } from "@blueprintjs/core";
import Window from "./Window";
import BSON from "bson-objectid";
import Empty from "./Widget/Empty";

const ResponsiveGridLayout = WidthProvider(Responsive);

class GridLayout extends React.Component {
  state = {
    rowHeight: 150,
    breakpoints: null
  }
  onResize(entries) {
    let height = 1;
    entries.forEach(e => height = e.contentRect.height);
    const rowHeight = Math.abs(height / this.props.rows) - this.props.margin[1] * 1.3;
    this.setState(() => ({ rowHeight }))
  }
  onBreakpointChange(bp) {
    this.setState(() => ({
      breakpoints: bp
    }))
  }
  render() {
    const { children, rows, style, ...props } = this.props;
    return (
      <ResizeSensor onResize={this.onResize.bind(this)}>
        <Box
          bg={Colors.GRAY4}
          style={{
            position: "fixed",
            overflow: "auto",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <ResponsiveGridLayout
            style={{ height: "100%", ...style }}
            onBreakpointChange={this.onBreakpointChange.bind(this)}
            {...props}
            rowHeight={this.state.rowHeight}
          >
            {children}
          </ResponsiveGridLayout>
        </Box>
      </ResizeSensor>
    )
  }
}

GridLayout.defaultProps = {
  autoSize: true,
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  // compactType: null,
  // isBounded: true,
  isResizable: true,
  isDraggable: true,
  margin: [8, 10],
  preventCollision: true,
  rows: 4,
  draggableHandle: ".window-drag-handle",
}

export default GridLayout;