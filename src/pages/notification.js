import React from 'react';
import { HTMLTable } from '@blueprintjs/core';

const Notification = () => {
  return (
    <div>
      <HTMLTable condensed interactive>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2020-04-18T09:57:51.648+00:00</td>
            <td>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</td>
          </tr>
          <tr>
            <td>2020-04-18T09:42:09.577+00:00</td>
            <td>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </td>
          </tr>
        </tbody>
      </HTMLTable>
    </div>
  )
}

export default Notification;