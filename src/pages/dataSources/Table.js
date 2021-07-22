import React from "react";
import { ResizeSensor, Text } from "@blueprintjs/core";
import { Table as RVTable, Column } from "react-virtualized";
import _get from "lodash/get";

import { Box, Flex } from "components/utility/grid";

class Table extends React.PureComponent {
  state = {
    width: 0,
    height: 0
  }
  _headerColRenderer({ label, ...bb }) {
    return (
      <Box
        px={2}
        fontWeight="bold"
        style={{
          textTransform: "capitalize"
        }}
      >
        {label}
      </Box>
    )
  }
  _RowRenderer({ key, className, columns, style }) {
    return (
      <Flex
        key={key}
        className={className}
        style={style}
        alignItems="center"
      >
        {columns}
      </Flex>
    )
  }
  render() {
    return (
      <ResizeSensor onResize={(entries) => {
        entries.forEach(e => this.setState({ height: e.contentRect.height, width: e.contentRect.width }));
      }}>
        <Box className={this.props.className} style={this.props.style}>
          <RVTable
            height={this.state.height}
            width={this.state.width}
            headerHeight={48}
            headerRowRenderer={this._RowRenderer}
            rowRenderer={this._RowRenderer}
            rowHeight={36}
            rowCount={this.props.data.length}
            rowGetter={({ index }) => {
              return this.props.data[index];
            }}
          >
            {this.props.columns.length > 0 && this.props.columns.map(({ dataKey, label, cellRenderer, width }) => {
              if (typeof cellRenderer !== "function") {
                cellRenderer = ({ cellData }) => (
                  <Box px={2}>
                    <Text ellipsize>
                      {String(cellData)}
                    </Text>
                  </Box>
                );
              }
              return (
                <Column
                  key={dataKey}
                  label={label}
                  width={width || 150}
                  dataKey={dataKey}
                  cellDataGetter={({ rowData, dataKey }) => _get(rowData, dataKey)}
                  headerRenderer={this._headerColRenderer}
                  cellRenderer={cellRenderer}
                />)
            }
            )}
          </RVTable>
        </Box>
      </ResizeSensor>
    )
  }
}

export default Table;