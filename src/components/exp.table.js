import React from 'react';
import { HTMLTable } from '@blueprintjs/core';

const Table = ({ options, series, style, ...props }) => {
  console.log(style);
  const heading = options.labels.map((v, i) => (
    <td key={i}>{v}</td>
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