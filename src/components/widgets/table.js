import React, { useCallback } from 'react';

import { Table as BPTable, Column, Cell } from '@blueprintjs/table';

const Table = ({ options, series }) => {
  const getColumn = useCallback((name, index) => {
    const cellRenderer = (rowIndex, columnIndex) => (
      <Cell>{series[rowIndex][columnIndex]}</Cell>
    )
    return (
      <Column
        cellRenderer={cellRenderer}
        key={index}
        name={name} />
    )
  }, [series])
  const columns = options.labels.map((v, i) => {
    return getColumn(v, i);
  });
  return (
    <BPTable numRows={series.length}>
      {columns}
    </BPTable>
  )
}

export default Table;