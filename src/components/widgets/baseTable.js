import React, { useCallback } from 'react';
import { Table as BPTable, Column, Cell } from '@blueprintjs/table';
import _merge from 'lodash.merge';
import * as TableClasses from '@blueprintjs/table/lib/esm/common/classes';

const defaultOptions = {}

const BaseTable = ({ series, ...props }) => {
  const options = _merge(defaultOptions, props.options);
  const getColumn = useCallback((name, index) => {
    let nameProps = { name };
    if (typeof name === 'object')
      nameProps = {
        name: name.title,
        nameRenderer: (n) => {
          return (<>
            <div className={TableClasses.TABLE_TRUNCATED_TEXT}>{n}</div>
            <div className={TableClasses.TABLE_TRUNCATED_TEXT}>
              <small>{name.subtitle}</small>
            </div>
          </>)
        }
      }

    const cellRenderer = (rowIndex, columnIndex) => (<Cell>{series[rowIndex][columnIndex]}</Cell>)
    return (
      <Column
        cellRenderer={cellRenderer}
        key={index}
        {...nameProps} />
    )
  }, [series]);
  const columns = options.labels.map((v, i) => {
    return getColumn(v, i);
  });
  return (
    <BPTable numRows={series.length}>
      {columns}
    </BPTable>
  )
}

export default BaseTable;