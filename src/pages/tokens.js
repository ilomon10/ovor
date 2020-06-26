import React from 'react';
import { Button, Colors, H2, HTMLTable } from '@blueprintjs/core';
import moment from 'moment';
import Container from 'components/container';
import Wrapper from 'components/wrapper';
import InputCopy from 'components/inputCopy';

const Tokens = () => {
  return (
    <div style={{ backgroundColor: Colors.LIGHT_GRAY5, height: '100%', position: "relative" }}>
      <Wrapper style={{ overflowY: 'auto' }}>
        <Container style={{ paddingTop: 16 }}>
          <div className="flex">
            <div className="flex-grow">
              <H2>Access Token</H2>
            </div>
            <div className="flex-shrink-0">
              <Button
                icon="plus"
                text="Generate new token" />
            </div>
          </div>
          <p>You need API access token to configure on device.</p>
          <HTMLTable style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Token</th>
                <th>Last modified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ verticalAlign: "middle" }}>Default token</td>
                <td>
                  <InputCopy fill small
                    defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE1OTMwMDg0ODcsImV4cCI6MTU5MzA5NDg4NywiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiNWU4ODQzZTIyYzBkOGIwMmUxZDU4ZjIwIiwianRpIjoiNzM0MWM5M2QtMWU1ZS00NDk5LTk2NjctMjNkMWMyOWRhNmVkIn0.nZt1YfE9lYdWYZptMJH-hBiWUEjTQrcwVK1UeWr7jvY" />
                </td>
                <td style={{ verticalAlign: "middle" }}>{moment().calendar()}</td>
                <td><Button minimal small
                  intent="danger"
                  icon="trash" /></td>
              </tr>
            </tbody>
          </HTMLTable>
        </Container>
      </Wrapper>
    </div>
  )
}

export default Tokens;