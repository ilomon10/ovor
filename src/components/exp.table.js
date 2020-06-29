import React from 'react';
import { HTMLTable } from '@blueprintjs/core';

const Table = ({ options, series, style, ...props }) => {
  const heading = options.labels.map((v, i) => (
    <th key={i}>{v}</th>
  ))
  const body = series.map((val, idx) => {
    return (
      <tr key={idx}>
        {val.map((v, i) => (
          <td key={i}>{v}</td>
        ))}
      </tr>
    )
  })
  return (
    <HTMLTable {...props} style={{ width: "100%", ...style }}>
      <thead>
        <tr>
          {heading}
        </tr>
      </thead>
      <tbody>
        {body}
      </tbody>
    </HTMLTable>
  )
}

export default Table;